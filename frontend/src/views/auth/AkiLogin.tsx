import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GithubAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';

import { auth } from '@/lib/firebase';

function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function AkiLogin() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const provider = useMemo(() => {
    const githubProvider = new GithubAuthProvider();
    githubProvider.addScope('read:user');
    githubProvider.addScope('user:email');
    githubProvider.setCustomParameters({ allow_signup: 'true' });
    return githubProvider;
  }, []);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/', { replace: true });
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleGithubSignIn = async () => {
    if (!auth) {
      console.error('[AkiLogin] Firebase auth indisponible');
      return;
    }

    setBusy(true);
    try {
      if (isMobileDevice()) {
        await signInWithRedirect(auth, provider);
        return;
      }
      await signInWithPopup(auth, provider);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('[AkiLogin] Erreur Firebase GitHub OAuth:', error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] flex items-center justify-center p-6 text-white text-center">
      <div className="w-full max-w-md bg-[#0d1117] p-10 rounded-[3rem] border border-blue-500/20 shadow-2xl">
        <h2 className="text-2xl font-black mb-4 text-blue-500 italic">AKI HORIZON v17</h2>
        <p className="text-[9px] text-gray-500 mb-8 uppercase tracking-widest">
          ID: Iv23licpHW2aEri3J4Q
        </p>
        <button
          type="button"
          onClick={handleGithubSignIn}
          disabled={busy}
          className="w-full py-5 bg-[#24292f] text-white rounded-2xl font-black flex items-center justify-center gap-4 border border-white/10 active:scale-95 transition-all disabled:opacity-70"
        >
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            className="w-6 h-6 invert"
            alt="GitHub"
          />
          {busy ? 'CONNEXION…' : 'ENTRER VIA GITHUB'}
        </button>
      </div>
    </div>
  );
}
