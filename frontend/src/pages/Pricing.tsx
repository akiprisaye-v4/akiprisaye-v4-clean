import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { pricingPlans } from "../data/pricingPlans";

function formatPrice(p: number | "gratuit") {
  if (p === "gratuit") return "Gratuit";
  return `${p.toFixed(2).replace(".", ",")} €`;
}

export default function Pricing() {
  const { subs, annuals, options } = useMemo(() => {
    const subs = pricingPlans.filter((p) => p.cadence === "mensuel" && p.id !== "freemium");
    const annuals = pricingPlans.filter((p) => p.cadence === "annuel");
    const options = pricingPlans.filter((p) => p.cadence === "option");
    const freemium = pricingPlans.find((p) => p.id === "freemium");
    return { subs: freemium ? [freemium, ...subs] : subs, annuals, options };
  }, []);

  return (
    <>
      <Helmet>
        <title>Offres & Abonnements – A KI PRI SA YÉ</title>
        <meta
          name="description"
          content="Découvrez les formules Freemium, Pro et Premium, ainsi que les options (OCR, IA) pour A KI PRI SA YÉ."
        />
      </Helmet>

      <main style={{ padding: "24px 16px", maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>Offres & abonnements</h1>
          <p style={{ opacity: 0.85, marginTop: 8, lineHeight: 1.5 }}>
            Choisis une formule adaptée à ton usage. Freemium pour démarrer, Pro/Premium pour analyser et suivre tes
            prix, options pour aller plus loin.
          </p>
        </header>

        <section style={{ marginTop: 18 }}>
          <h2 style={{ fontSize: 18, margin: "0 0 12px 0", opacity: 0.9 }}>Formules</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {subs.map((p) => (
              <article
                key={p.id}
                style={{
                  borderRadius: 16,
                  padding: 16,
                  border: p.highlight ? "1px solid rgba(59,130,246,0.6)" : "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: p.highlight ? "0 0 0 1px rgba(59,130,246,0.15) inset" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: 16 }}>{p.name}</strong>
                      {p.badge ? (
                        <span
                          style={{
                            fontSize: 12,
                            padding: "3px 8px",
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            opacity: 0.95,
                          }}
                        >
                          {p.badge}
                        </span>
                      ) : null}
                    </div>
                    <p style={{ margin: "8px 0 0 0", opacity: 0.85, lineHeight: 1.45 }}>{p.description}</p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{formatPrice(p.priceEur)}</div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>{p.priceEur === "gratuit" ? "" : "/ mois"}</div>
                  </div>
                </div>

                <ul style={{ margin: "12px 0 0 0", paddingLeft: 18, opacity: 0.92, lineHeight: 1.5 }}>
                  {p.features.slice(0, 6).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                {p.limits?.length ? (
                  <details style={{ marginTop: 10, opacity: 0.85 }}>
                    <summary style={{ cursor: "pointer" }}>Limites</summary>
                    <ul style={{ margin: "8px 0 0 0", paddingLeft: 18 }}>
                      {p.limits.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </details>
                ) : null}

                <div style={{ marginTop: 14 }}>
                  <a
                    href={p.ctaHref}
                    style={{
                      display: "inline-block",
                      padding: "10px 12px",
                      borderRadius: 12,
                      textDecoration: "none",
                      background: p.highlight ? "rgba(59,130,246,0.95)" : "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {p.ctaLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {annuals.length ? (
          <section style={{ marginTop: 22 }}>
            <h2 style={{ fontSize: 18, margin: "0 0 12px 0", opacity: 0.9 }}>Annuel</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              {annuals.map((p) => (
                <article
                  key={p.id}
                  style={{
                    borderRadius: 16,
                    padding: 16,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <strong style={{ fontSize: 16 }}>{p.name}</strong>
                  <p style={{ margin: "8px 0 0 0", opacity: 0.85 }}>{p.description}</p>
                  <div style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>{formatPrice(p.priceEur)} / an</div>
                  <ul style={{ margin: "10px 0 0 0", paddingLeft: 18, opacity: 0.92 }}>
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 12 }}>
                    <a
                      href={p.ctaHref}
                      style={{
                        display: "inline-block",
                        padding: "10px 12px",
                        borderRadius: 12,
                        textDecoration: "none",
                        background: "rgba(255,255,255,0.10)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      {p.ctaLabel}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {options.length ? (
          <section style={{ marginTop: 22 }}>
            <h2 style={{ fontSize: 18, margin: "0 0 12px 0", opacity: 0.9 }}>Options</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              {options.map((p) => (
                <article
                  key={p.id}
                  style={{
                    borderRadius: 16,
                    padding: 16,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <strong style={{ fontSize: 16 }}>{p.name}</strong>
                      <p style={{ margin: "8px 0 0 0", opacity: 0.85 }}>{p.description}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{formatPrice(p.priceEur)}</div>
                      <div style={{ fontSize: 12, opacity: 0.75 }}>/ mois</div>
                    </div>
                  </div>

                  <ul style={{ margin: "10px 0 0 0", paddingLeft: 18, opacity: 0.92 }}>
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>

                  <div style={{ marginTop: 12 }}>
                    <a
                      href={p.ctaHref}
                      style={{
                        display: "inline-block",
                        padding: "10px 12px",
                        borderRadius: 12,
                        textDecoration: "none",
                        background: "rgba(255,255,255,0.10)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      {p.ctaLabel}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section id="contact" style={{ marginTop: 26, paddingTop: 10 }}>
          <h2 style={{ fontSize: 18, margin: "0 0 10px 0", opacity: 0.9 }}>Activer un abonnement</h2>
          <p style={{ opacity: 0.85, lineHeight: 1.5 }}>
            Paiement Stripe/PayPal branchable ensuite. Pour l’instant, ce bouton peut ouvrir un canal de contact.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <a
              href="/contact"
              style={{
                display: "inline-block",
                padding: "10px 12px",
                borderRadius: 12,
                textDecoration: "none",
                background: "rgba(59,130,246,0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "white",
                fontWeight: 700,
              }}
            >
              Contacter
            </a>
            <a
              href="/"
              style={{
                display: "inline-block",
                padding: "10px 12px",
                borderRadius: 12,
                textDecoration: "none",
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "white",
                fontWeight: 600,
              }}
            >
              Retour accueil
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
