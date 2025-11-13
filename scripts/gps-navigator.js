/**
 * gps-navigator.js
 *
 * Gestion du GPS + Arrêts Promo Intelligents
 */

import { getDB } from "../firebase-config.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Ouvre Google Maps pour naviguer vers une adresse ou des coords.
 */
export function openGPS(lat, lon, name = "") {
  const base = `https://www.google.com/maps/dir/?api=1`;
  const url = `${base}&destination=${lat},${lon}&travelmode=driving`;

  console.log("[GPS] Ouverture :", url);
  window.open(url, "_blank");
}

/**
 * Charge toutes les promotions dans Firestore
 */
async function loadPromotions() {
  const db = await getDB();
  const col = collection(db, "promotions");

  const snap = await getDocs(col);

  const promos = [];
  snap.forEach((doc) => promos.push({ id: doc.id, ...doc.data() }));

  return promos;
}

/**
 * Retourne les magasins situés à moins de X km de l’itinéraire
 */
export async function findPromosOnRoute(userLat, userLon, destLat, destLon) {
  const db = await getDB();
  const col = collection(db, "stores");
  const snap = await getDocs(col);

  const promos = await loadPromotions();

  const results = [];

  snap.forEach((doc) => {
    const store = doc.data();
    if (!store.lat || !store.lon) return;

    // Distance simple (approximation)
    const dist =
      Math.sqrt(
        Math.pow(store.lat - (userLat + destLat) / 2, 2) +
        Math.pow(store.lon - (userLon + destLon) / 2, 2)
      ) * 111; // conversion degrés -> km

    if (dist < 5) {
      // Vérifie si promo active pour ce magasin
      const p = promos.filter((x) => x.storeId === doc.id);

      results.push({
        storeId: doc.id,
        name: store.name,
        distance: dist.toFixed(2),
        lat: store.lat,
        lon: store.lon,
        promos: p
      });
    }
  });

  return results;
}

/**
 * UI simple : transforme les promos en HTML
 */
export function renderPromoStops(list) {
  if (!list.length) {
    return `<p>Aucune promotion détectée sur votre trajet.</p>`;
  }

  return list
    .map(
      (item) => `
        <div class="promo-stop">
          <h3>${item.name} (${item.distance} km)</h3>
          ${
            item.promos.length
              ? item.promos
                  .map(
                    (p) => `
                <div class="promo-item">
                  <strong>${p.title}</strong><br>
                  ${p.description}<br>
                  <button onclick="openGPS(${item.lat}, ${item.lon}, '${item.name}')">
                    ➜ Aller vers le magasin
                  </button>
                </div>`
                  )
                  .join("")
              : "<p>Aucune promotion active</p>"
          }
        </div>
      `
    )
    .join("");
}