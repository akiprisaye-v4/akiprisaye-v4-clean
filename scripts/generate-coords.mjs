import fs from "fs";
import fetch from "node-fetch";

console.log("🛰️ Générateur automatique de coordonnées GPS…");

const inputPath = new URL("./stores.json", import.meta.url);
const outputPath = new URL("./stores_with_coords.json", import.meta.url);

const raw = fs.readFileSync(inputPath, "utf8");
const stores = JSON.parse(raw);

// Fonction pour dormir entre 2 requêtes (évite bannissement Nominatim)
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function fetchCoords(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "A-KI-PRI-SA-YE/1.0 (akiprisaye-web.pages.dev)",
    },
  });

  const data = await res.json();

  if (data.length === 0) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

async function processAll() {
  let filled = 0;

  for (const store of stores) {
    if (store.lat && store.lng) {
      console.log(`⏭️ Déjà présent : ${store.name}`);
      continue;
    }

    const fullAddress = `${store.city || ""}, ${store.territory || ""} ${store.address || ""}`;
    console.log(`🔍 Recherche : ${store.name} → ${fullAddress}`);

    const coords = await fetchCoords(fullAddress);

    if (!coords) {
      console.log(`❌ Aucune coordonnée trouvée pour : ${store.name}`);
    } else {
      store.lat = coords.lat;
      store.lng = coords.lng;
      filled++;
      console.log(`✅ Coordonnées trouvées : ${store.lat}, ${store.lng}`);
    }

    // Pause obligatoire 1 seconde
    await delay(1000);
  }

  fs.writeFileSync(outputPath, JSON.stringify(stores, null, 2), "utf8");

  console.log(`\n🎉 FINI !`);
  console.log(`📍 Coordonnées ajoutées pour ${filled} magasin(s).`);
  console.log(`📦 Fichier généré : stores_with_coords.json\n`);
}

processAll();
