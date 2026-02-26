import React from 'react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Abonnements & Options
          </h1>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-300 max-w-3xl">
            Commence en gratuit. Active ensuite Pro ou Business selon ton niveau
            d’exploitation (analyses, alertes, API, exports, multi-territoires).
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Gratuit
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Découvrir et contribuer.
            </p>
            <div className="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white">
              0 €
            </div>
            <button className="mt-8 inline-flex items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 text-sm font-semibold hover:opacity-90 transition">
              Commencer
            </button>
          </div>

          <div className="rounded-2xl border-2 border-black dark:border-white bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pro
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Pour pros, associations, médias, analystes.
            </p>
            <div className="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white">
              49 € <span className="text-base font-medium">/mois</span>
            </div>
            <button className="mt-8 inline-flex items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-slate-900 px-5 py-3 text-sm font-semibold hover:opacity-90 transition">
              Choisir Pro
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Business
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Pour équipes et exploitation intensive.
            </p>
            <div className="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white">
              99 € <span className="text-base font-medium">/mois</span>
            </div>
            <button className="mt-8 inline-flex items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 text-sm font-semibold hover:opacity-90 transition">
              Choisir Business
            </button>
          </div>

        </section>

      </div>
    </div>
  )
}
