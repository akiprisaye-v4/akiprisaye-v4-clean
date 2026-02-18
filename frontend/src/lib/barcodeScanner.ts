/* eslint-disable no-undef */
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType, NotFoundException, type Result } from '@zxing/library';

export interface CameraDiagnostics {
  settings: MediaTrackSettings;
  capabilities: MediaTrackCapabilities | null;
}

export interface DecoderAttempt {
  attempts: number;
  lastError: string;
}

export interface DecoderRoi {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SUPPORTED_FORMATS: BarcodeFormat[] = [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.CODE_128,
];

const DEFAULT_ROI: DecoderRoi = {
  x: 0.15,
  y: 0.32,
  width: 0.7,
  height: 0.36,
};

export function createBarcodeReader() {
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, SUPPORTED_FORMATS);
  hints.set(DecodeHintType.TRY_HARDER, true);
  hints.set(DecodeHintType.ALSO_INVERTED, true);
  return new BrowserMultiFormatReader(hints);
}

export async function openRearCameraStream(preferredDeviceId?: string): Promise<MediaStream> {
  const constraints: MediaTrackConstraints = {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 30 },
    ...(preferredDeviceId ? { deviceId: { exact: preferredDeviceId } } : {}),
  };

  return navigator.mediaDevices.getUserMedia({ video: constraints, audio: false });
}

export async function downscaleTrackIfNeeded(track: MediaStreamTrack) {
  const settings = track.getSettings();
  const width = settings.width ?? 0;
  const height = settings.height ?? 0;
  if (width > 1920 || height > 1920) {
    await track.applyConstraints({ width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30, max: 30 } });
  }
}

export function readTrackDiagnostics(track: MediaStreamTrack): CameraDiagnostics {
  const capabilities = typeof track.getCapabilities === 'function' ? track.getCapabilities() : null;
  const settings = track.getSettings();
  return { settings, capabilities };
}

export function startFrameDecodeLoop(params: {
  reader: BrowserMultiFormatReader;
  video: HTMLVideoElement;
  onDetected: (result: Result) => void;
  onAttempt?: (attempt: DecoderAttempt) => void;
  onError?: (error: unknown) => void;
  intervalMs?: number;
  roi?: DecoderRoi;
}) {
  const { reader, video, onDetected, onAttempt, onError, intervalMs = 100, roi = DEFAULT_ROI } = params;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let rafId = 0;
  let lastTick = 0;
  let stopped = false;
  let attempts = 0;

  const loop = (ts: number) => {
    if (stopped) return;

    if (ts - lastTick < intervalMs) {
      rafId = window.requestAnimationFrame(loop);
      return;
    }
    lastTick = ts;

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0 || video.readyState < 2) {
      rafId = window.requestAnimationFrame(loop);
      return;
    }

    const sourceW = video.videoWidth;
    const sourceH = video.videoHeight;
    const sx = Math.floor(sourceW * roi.x);
    const sy = Math.floor(sourceH * roi.y);
    const sw = Math.max(1, Math.floor(sourceW * roi.width));
    const sh = Math.max(1, Math.floor(sourceH * roi.height));

    const portrait = window.innerHeight > window.innerWidth;

    if (portrait && sh > sw) {
      canvas.width = sh;
      canvas.height = sw;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(video, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);
      ctx.restore();
    } else {
      canvas.width = sw;
      canvas.height = sh;
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    }

    attempts += 1;
    try {
      const result = reader.decodeFromCanvas(canvas);
      onDetected(result);
    } catch (error) {
      if (!(error instanceof NotFoundException) && onError) onError(error);
      onAttempt?.({ attempts, lastError: error instanceof Error ? error.message : String(error) });
    }

    rafId = window.requestAnimationFrame(loop);
  };

  rafId = window.requestAnimationFrame(loop);

  return () => {
    stopped = true;
    window.cancelAnimationFrame(rafId);
  };
}
