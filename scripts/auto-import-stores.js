/**
 * MEGA AUTO-IMPORT DOM-TOM
 * Importation automatique dans Firestore (collection: stores)
 * Territoires : Guadeloupe, Martinique, Guyane, Réunion, Mayotte, Saint-Martin, Saint-Barth
 * Compatible Cloudflare Pages + Firebase lazy-loading
 */

import { getDB } from "../firebase-config.js";

/* ---------------------------------------------------------
   LISTE OFFICIELLE DES MAGASINS PAR TERRITOIRE
--------------------------------------------------------- */
const storesDOMTOM = [
  /* ------------------ GUADELOUPE ------------------- */
  {
    territory: "guadeloupe",
    name: "Super U Bas-du-Fort",
    address: "Bas-du-Fort, Le Gosier, Guadeloupe",
    chain: "Super U",
    phone: "0590 99 99 99"
  },
  {
    territory: "guadeloupe",
    name: "Carrefour Destrellan",
    address: "Destrellan, Baie-Mahault, Guadeloupe",
    chain: "Carrefour",
    phone: "0590 26 92 92"
  },
  {
    territory: "guadeloupe",
    name: "Géant Casino Dothémare",
    address: "Dothémare, Les Abymes, Guadeloupe",
    chain: "Géant Casino",
    phone: ""
  },

  /* ------------------ MARTINIQUE ------------------- */
  {
    territory: "martinique",
    name: "Hyper U La Galléria",
    address: "Centre Commercial La Galléria, Le Lamentin, Martinique",
    chain: "Hyper U",
    phone: ""
  },
  {
    territory: "martinique",
    name: "Carrefour Cluny",
    address: "Centre Commercial Cluny, Fort-de-France, Martinique",
    chain: "Carrefour",
    phone: ""
  },
  {
    territory: "martinique",
    name: "Leader Price Dillon",
    address: "Dillon, Fort-de-France, Martinique",
    chain: "Leader Price",
    phone: ""
  },

  /* ------------------ GUYANE ----------------------- */
  {
    territory: "guyane",
    name: "Super U Montjoly",
    address: "Route de Montjoly, Remire-Montjoly, Guyane",
    chain: "Super U",
    phone: ""
  },
  {
    territory: "guyane",
    name: "Carrefour Market Cayenne",
    address: "Cayenne, Guyane",
    chain: "Carrefour Market",
    phone: ""
  },

  /* ------------------ RÉUNION ---------------------- */
  {
    territory: "reunion",
    name: "E.Leclerc Saint-Denis",
    address: "Saint-Denis, La Réunion",
    chain: "E.Leclerc",
    phone: ""
  },
  {
    territory: "reunion",
    name: "Carrefour Saint-Pierre",
    address: "Saint-Pierre, La Réunion",
    chain: "Carrefour",
    phone: ""
  },
  {
    territory: "reunion",
    name: "Leader Price Saint-André",
    address: "Saint-André, La Réunion",
    chain: "Leader Price",
    phone: ""
  },

  /* ------------------ MAYOTTE ---------------------- */
  {
    territory: "mayotte",
    name: "Super U Dembéni",
    address: "Dembéni, Mayotte",
    chain: "Super U",
    phone: ""
  },
  {
    territory: "mayotte",
    name: "Carrefour Mamoudzou",
    address: "Mamoudzou, Mayotte",
    chain: "Carrefour",
    phone: ""
  },

  /* ------------------ SAINT-MARTIN ---------------------- */
  {
    territory: "saint-martin",
    name: "Super U Howell Center",
    address: "Howell Center, Marigot, Saint-Martin",
    chain: "Super U",
    phone: ""
  },

  /* ------------------ SAINT-BARTH ---------------------- */
  {
    territory: "saint-barth",
    name: "Marché U Saint-Barth",
    address: "Saint-Jean, Saint-Barthélemy",
    chain: "U",
    phone: ""
  }
];

/* ---------------------------------------------------------
   GÉOCODAGE OPENSTREETMAP (NOMINATIM)
--------------------------------------------------------- */
async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "fr",
        "User-Agent": "akiprisaye-web/1.0 (+https://akiprisaye-web.pages.dev)"
      }
    });

    const data = await res.json();
    if (!data[0]) return { lat: null, lon: null };

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  } catch (e) {
    console.error("Erreur géocodage :", e);
    return { lat: null, lon: null };
  }
}

/* ---------------------------------------------------------
   IMPORT FIRESTORE
--------------------------------------------------------- */
async function autoImport() {
  console.log("🚀 Import automatique DOM-TOM → Firestore…");

  const db = await getDB();
  const { collection, doc, setDoc } = await import(
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
  );

  for (const store of storesDOMTOM) {
    const { lat, lon } = await geocode(store.address);

    const ref = doc(collection(db, "stores"));

    await setDoc(ref, {
      name: store.name,
      address: store.address,
      chain: store.chain,
      phone: store.phone,
      lat,
      lon,
      openingHours: "08:00 - 20:00",
      territory: store.territory
    });

    console.log(`✅ ${store.territory.toUpperCase()} → ${store.name}`);

    await new Promise((r) => setTimeout(r, 1000)); // Anti-ban
  }

  console.log("🎉 IMPORT COMPLET DOM-TOM TERMINÉ !");
}

autoImport();