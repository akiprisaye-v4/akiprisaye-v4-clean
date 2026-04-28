import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/authHook';
import { getAuthErrorMessage } from '@/lib/authMessages';

function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function AkiLogin() {
  const navigate = useNavigate();
  const {
    user,
    loading,
    authFlowState,
    signInGithubPopup,
    signInGithubRedirect,
    clearError,
  } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [navigate, user]);

  const handleGithubSignIn = async () => {
    clearError();

    try {
      if (isMobileDevice()) {
        await signInGithubRedirect();
        return;
      }
      await signInGithubPopup();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('[AkiLogin] Erreur Firebase GitHub OAuth:', error);
      console.error('[AkiLogin] Message normalisé:', getAuthErrorMessage(error));
    }
  };

  const isBusy = loading || authFlowState === 'starting' || authFlowState === 'redirecting';

  return (
    <div className="min-h-screen bg-[#06090f] flex items-center justify-center p-6 text-white text-center">
      <div className="w-full max-w-md bg-[#0d1117] p-10 rounded-[3rem] border border-blue-500/20 shadow-2xl">
        <h2 className="text-2xl font-black mb-4 text-blue-500 italic">AKI HORIZON v18</h2>
        <p className="text-[9px] text-gray-500 mb-8 uppercase tracking-widest">
          ID: Ov23licp... · Firebase Redirect Handler actif
        </p>
        <button
          type="button"
          onClick={handleGithubSignIn}
          disabled={isBusy}
          className="w-full py-5 bg-[#24292f] text-white rounded-2xl font-black flex items-center justify-center gap-4 border border-white/10 active:scale-95 transition-all disabled:opacity-70"
        >
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            className="w-6 h-6 invert"
            alt="GitHub"
          />
          {isBusy ? 'CONNEXION EN COURS…' : 'ENTRER VIA GITHUB'}
        </button>

        {authFlowState === 'redirecting' && (
          <p className="text-xs text-slate-400 mt-4">Redirection sécurisée vers GitHub…</p>
        )}
      </div>
    </div>
  );
}
