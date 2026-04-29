import React, { useState, useEffect } from 'react';
import { GithubAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function AkiLogin() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRedirectResult(auth).catch((err) => console.error("Erreur de retour:", err));
  }, []);

  const handleGitHub = async () => {
    setLoading(true);
    const provider = new GithubAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  return (
    <div className="min-h-screen bg-[#06090f] flex items-center justify-center p-6 text-white text-center font-sans">
      <div className="w-full max-w-md bg-[#0d1117] p-10 rounded-[3rem] border border-blue-500/20 shadow-2xl">
        <h2 className="text-2xl font-black mb-4 text-blue-500 italic uppercase">Aki Horizon v38</h2>
        <p className="text-[10px] text-gray-500 mb-8 uppercase tracking-widest">Build Purifié ✅</p>
        <button onClick={handleGitHub} disabled={loading} className="w-full py-5 bg-[#24292f] text-white rounded-2xl font-black flex items-center justify-center gap-4 border border-white/10 active:scale-95 transition-all">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" className="w-6 h-6 invert" alt="GH" />
          {loading ? 'CHARGEMENT...' : 'ENTRER VIA GITHUB'}
        </button>
      </div>
    </div>
  );
}
