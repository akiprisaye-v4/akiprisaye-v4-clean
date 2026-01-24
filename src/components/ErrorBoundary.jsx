import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // Extension future possible :
    // sendErrorToMonitoring(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900 border border-red-500/30 rounded-xl p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Une erreur est survenue
            </h1>

            <p className="text-slate-300 mb-6">
              Une erreur temporaire est survenue. Le service reste accessible.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-red-400 font-semibold mb-2">
                  Détails techniques (développement uniquement)
                </summary>
                <div className="bg-slate-800 p-4 rounded-lg overflow-auto">
                  <p className="text-red-400 font-mono text-sm mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-slate-400 text-xs overflow-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {!import.meta.env.DEV && (
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 mb-6">
                <p className="text-blue-200 text-sm">
                  Si le problème persiste, veuillez nous contacter via la page contact.
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Réessayer
              </button>

              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Retour à l’accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;