import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Titre */}
        <Link
          to="/"
          className="text-white font-bold text-xl tracking-tight"
        >
          A KI PRI SA YÉ
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6">
          <Link
            to="/"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Accueil
          </Link>

          <Link
            to="/comparateur"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Comparateur
          </Link>

          <Link
            to="/actualites"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Actualités
          </Link>

          <Link
            to="/contact"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}