import { useState } from "react";
import { runOcr } from "../ocr/useOcr";

export default function OcrScanner() {
  const [text, setText] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setText("");
    setProgress(0);

    try {
      const result = await runOcr(file, setProgress);
      setText(result);
    } catch (err) {
      setText("Erreur OCR");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={loading}
      />

      {progress !== null && <p>Analyse : {progress}%</p>}

      {text && (
        <pre
          style={{
            marginTop: 16,
            whiteSpace: "pre-wrap",
            background: "#020617",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {text}
        </pre>
      )}
    </div>
  );
}