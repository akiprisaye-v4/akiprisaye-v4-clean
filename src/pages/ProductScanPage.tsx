import React, { useEffect, useState } from 'react';
import ScanProductPWA from '../components/ScanProductPWA';

export default function ProductScanPage({ ean }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/scan/${ean}`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      });
  }, [ean]);

  return loading ? <div>Chargement…</div> : (
    <ScanProductPWA {...data} />
  );
}
