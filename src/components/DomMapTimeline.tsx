import { useEffect, useState } from 'react';
import { loadDomIndexesForMonth } from '../services/domMapTimelineService';
import DomMapSvg from './DomMapSvg';

const MONTHS = ['2025-11', '2025-12', '2026-01'];

export default function DomMapTimeline() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, number>>({});

  useEffect(() => {
    let alive = true;

    loadDomIndexesForMonth(MONTHS[step]).then((data) => {
      if (!alive) return;

      const map: Record<string, number> = {};
      data.forEach(d => (map[d.territory] = d.index));
      setValues(map);
    });

    return () => {
      alive = false;
    };
  }, [step]);

  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-4">
      <h2 className="font-semibold mb-2">
        Carte du surcoût — {MONTHS[step]}
      </h2>

      <DomMapSvg values={values} />

      <input
        type="range"
        min={0}
        max={MONTHS.length - 1}
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
        className="w-full mt-4"
      />
    </div>
  );
}