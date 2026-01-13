/**
 * Carte Hub - Unified entry point for all map and route features
 * 
 * Groups map and GPS functionalities:
 * - Store locator map
 * - Route optimization
 * - Shopping list route planning
 * - Multi-destination optimizer
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Map, Navigation, Route, MapPin, ShoppingCart, Compass } from 'lucide-react';

interface MapFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  color: string;
  badge?: string;
}

const MAP_FEATURES: MapFeature[] = [
  {
    id: 'map',
    title: 'Carte des Magasins',
    description: 'Visualisez tous les magasins et comparez les prix à proximité',
    icon: Map,
    route: '/carte',
    color: 'blue',
    badge: 'Principal',
  },
  {
    id: 'routes',
    title: 'Optimiseur d\'Itinéraire',
    description: 'Optimisez vos trajets entre plusieurs magasins pour économiser du temps et de l\'essence',
    icon: Route,
    route: '/carte?mode=route-optimizer',
    color: 'green',
    badge: 'GPS',
  },
  {
    id: 'shopping-list',
    title: 'Liste de Courses Intelligente',
    description: 'Planifiez votre parcours selon votre liste de courses',
    icon: ShoppingCart,
    route: '/liste-courses',
    color: 'purple',
    badge: 'Smart',
  },
  {
    id: 'nearby',
    title: 'À Proximité',
    description: 'Trouvez rapidement les magasins les plus proches de vous',
    icon: MapPin,
    route: '/carte?mode=nearby',
    color: 'orange',
  },
];

const BENEFITS = [
  {
    icon: '🗺️',
    title: 'Vue d\'ensemble',
    description: 'Tous les magasins DOM-COM sur une seule carte interactive',
  },
  {
    icon: '🚗',
    title: 'Économie d\'essence',
    description: 'Optimisez vos trajets pour réduire vos dépenses de carburant',
  },
  {
    icon: '⏱️',
    title: 'Gain de temps',
    description: 'Trouvez le meilleur parcours en quelques secondes',
  },
  {
    icon: '💰',
    title: 'Meilleurs prix',
    description: 'Comparez les prix sur votre trajet et faites des économies',
  },
];

export default function CarteHub() {
  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' | 'hover') => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', hover: 'hover:border-blue-500/50' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', hover: 'hover:border-green-500/50' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', hover: 'hover:border-purple-500/50' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', hover: 'hover:border-orange-500/50' },
    };
    return colorMap[color]?.[type] || colorMap.blue[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Helmet>
        <title>Carte & Itinéraires - A KI PRI SA YÉ</title>
        <meta name="description" content="Trouvez les magasins près de chez vous et optimisez vos trajets de courses" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            🗺️ Carte & Itinéraires
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Trouvez les magasins près de chez vous, comparez les prix, 
            et optimisez vos trajets pour économiser temps et argent.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {MAP_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.id}
                to={feature.route}
                className={`
                  relative group
                  bg-slate-900/50 backdrop-blur-sm
                  border-2 ${getColorClasses(feature.color, 'border')} ${getColorClasses(feature.color, 'hover')}
                  rounded-xl p-8
                  transition-all duration-300
                  hover:scale-105 hover:shadow-2xl
                `}
              >
                {/* Badge */}
                {feature.badge && (
                  <div className={`absolute top-4 right-4 ${getColorClasses(feature.color, 'bg')} ${getColorClasses(feature.color, 'text')} text-xs px-3 py-1 rounded-full font-medium`}>
                    {feature.badge}
                  </div>
                )}

                {/* Icon */}
                <div className={`${getColorClasses(feature.color, 'bg')} ${getColorClasses(feature.color, 'text')} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={32} />
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-semibold mb-3 ${getColorClasses(feature.color, 'text')}`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* CTA */}
                <div className={`${getColorClasses(feature.color, 'text')} flex items-center font-medium group-hover:translate-x-2 transition-transform`}>
                  Accéder <span className="ml-2">→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {BENEFITS.map((benefit, index) => (
            <div
              key={index}
              className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <h4 className="font-semibold text-slate-100 mb-2">{benefit.title}</h4>
              <p className="text-sm text-slate-400">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-slate-100 flex items-center gap-2">
            <Compass size={24} />
            Comment optimiser vos courses ?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">Localisez les magasins</h3>
                  <p className="text-sm text-slate-400">Visualisez tous les magasins sur la carte interactive</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">Comparez les prix</h3>
                  <p className="text-sm text-slate-400">Vérifiez les prix de vos produits dans chaque magasin</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">Optimisez votre trajet</h3>
                  <p className="text-sm text-slate-400">L'algorithme calcule le meilleur parcours pour vous</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">Économisez !</h3>
                  <p className="text-sm text-slate-400">Suivez l'itinéraire optimisé et profitez des meilleures offres</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <p className="text-slate-400 mb-4">Découvrez aussi nos autres outils</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/comparateur"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-300 text-sm transition"
            >
              📊 Comparateur de prix
            </Link>
            <Link
              to="/scanner"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-300 text-sm transition"
            >
              📷 Scanner un produit
            </Link>
            <Link
              to="/observatoire"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-300 text-sm transition"
            >
              📈 Observatoire des prix
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
