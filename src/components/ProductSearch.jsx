import { useState, useEffect } from 'react';

const DEBOUNCE = 250;

export default function ProductSearch({ territory, onPickEAN }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    if (timer) clearTimeout(timer);

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&territory=${encodeURIComponent(territory || 'Guadeloupe')}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Erreur recherche produit :', err);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE);
    setTimer(t);
  }, [query, territory]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Rechercher un produit (ex : riz basmati, lait, pâtes...)"
        className="w-full p-3 rounded-xl bg-slate-800 text-white outline-none placeholder-gray-400"
      />
      {loading && <div className="absolute right-3 top-3 text-xs text-gray-400">Chargement…</div>}
      {results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl max-h-80 overflow-auto">
          {results.map((p) => (
            <li
              key={p.ean}
              onClick={() => onPickEAN(p.ean)}
              className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer"
            >
              {p.image && (
                <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
              )}
              <div>
                <div className="text-gray-100 text-sm">{p.name}</div>
                <div className="text-gray-400 text-xs">{p.brand}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
