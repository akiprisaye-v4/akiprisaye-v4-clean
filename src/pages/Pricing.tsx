import { GlassCard } from "../components/ui/glass-card";

export default function Pricing() {
  return (
    <div className="grid gap-4">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-300 font-semibold">Niveaux d'accès au service</p>
        <p className="text-xs text-gray-400 mt-1">
          Observatoire public indépendant — L'accès aux données essentielles est libre
        </p>
      </div>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">Accès Public</h3>
        <p className="text-sm text-gray-200">Gratuit</p>
        <p className="text-xs text-gray-400 mt-1">
          Consultation libre des données observées
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">Accès Étendu Citoyen</h3>
        <p className="text-sm text-gray-200">2,50 € / mois</p>
        <p className="text-xs text-gray-400 mt-1">
          Contribution volontaire + alertes + historique étendu
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">Accès Analyse Territoriale</h3>
        <p className="text-sm text-gray-200">12 € / mois</p>
        <p className="text-xs text-gray-400 mt-1">
          Outils d'analyse + multi-territoires + export CSV
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold text-gray-100">Licence Institutionnelle</h3>
        <p className="text-sm text-gray-200">Convention annuelle</p>
        <p className="text-xs text-gray-400 mt-1">
          Accès contractuel aux données consolidées
        </p>
      </GlassCard>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Données observées • Transparence garantie • Sans publicité
      </p>
    </div>
  );
}