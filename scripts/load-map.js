// =====================================================
// A KI PRI SA YÉ — Initialisation de la carte Leaflet
// et chargement des magasins depuis Firestore
// =====================================================

import { loadMagasins } from "./magasins-firestore.js";

/**
 * Configuration des territoires (centre + zoom)
 */
const territories = {
  guadeloupe: { lat: 16.265, lon: -61.55, zoom: 10 },
  martinique: { lat: 14.6415, lon: -61.0242, zoom: 10 },
  guyane: { lat: 4.9224, lon: -52.3135, zoom: 8 },
  reunion: { lat: -21.1151, lon: 55.5364, zoom: 10 },
  mayotte: { lat: -12.8275, lon: 45.1662, zoom: 10 },
  saintmartin: { lat: 18.0708, lon: -63.0501, zoom: 11 },
  saintbarthelemy: { lat: 17.8963, lon: -62.8495, zoom: 12 },
  polynesie: { lat: -17.6797, lon: -149.4068, zoom: 5 },
  nouvellecaledonie: { lat: -22.2558, lon: 166.4505, zoom: 6 }
};

/**
 * Initialise la carte Leaflet + événements
 */
export async function loadMap() {
  const mapContainer = document.getElementById("map");
  const territorySelect = document.getElementById("territory-select");

  if (!mapContainer) {
    console.error("⚠️ Élément #map introuvable dans le DOM.");
    return;
  }

  if (!territorySelect) {
    console.error("⚠️ Élément #territory-select introuvable dans le DOM.");
    return;
  }

  // Territoire par défaut
  let selectedTerritory = territorySelect.value || "guadeloupe";

  // Création de la carte Leaflet
  const { lat, lon, zoom } = territories[selectedTerritory];

  const map = L.map("map", {
    center: [lat, lon],
    zoom,
    zoomControl: true
  });

  // Fond de carte sombre CARTO
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19
    }
  ).addTo(map);

  let markersLayer = L.layerGroup().addTo(map);

  /**
   * Charge et affiche les magasins pour un territoire
   */
  async function renderShops(territoryKey) {
    const territory = territories[territoryKey];
    if (!territory) {
      console.warn("Territoire inconnu:", territoryKey);
      return;
    }

    // Centre la carte sur le territoire choisi
    map.setView([territory.lat, territory.lon], territory.zoom);

    // Réinitialise les anciens marqueurs
    markersLayer.clearLayers();

    // Charge les magasins depuis Firestore
    let shops = [];
    try {
      shops = await loadMagasins(territoryKey);
    } catch (e) {
      console.error("Erreur Firestore →", e);
      shops = [];
    }

    // Ajout des marqueurs
    shops.forEach((shop) => {
      if (typeof shop.lat !== "number" || typeof shop.lon !== "number") {
        console.warn("Magasin sans coordonnées valides:", shop);
        return;
      }

      const marker = L.marker([shop.lat, shop.lon]).addTo(markersLayer);

      const popup = `
        <b>${shop.name || "Magasin"}</b><br>
        📍 ${shop.address || "Adresse inconnue"}<br>
        🕒 ${shop.openingHours || "Horaires non renseignés"}<br>
        ☎️ ${shop.phone || "Téléphone indisponible"}<br>
        🏬 ${shop.chain || "Indépendant"}
      `;

      marker.bindPopup(popup);
    });

    console.log(
      `Carte chargée pour ${territoryKey} avec ${shops.length} magasins.`
    );
  }

  // Premier affichage
  await renderShops(selectedTerritory);

  // Changement de territoire via le select
  territorySelect.addEventListener("change", async (e) => {
    selectedTerritory = e.target.value;
    await renderShops(selectedTerritory);
  });
}