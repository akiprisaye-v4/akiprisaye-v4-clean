import { TERRITORIES } from "./territories.js";
import { getStoresByTerritory } from "./magasins-firestore.js";

let map = null;
let markers = [];

/**
 * Initialise la carte Leaflet
 */
export function initInteractiveMap() {
  map = L.map("map-container", {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView([16.265, -61.551], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);
}

/**
 * Charge les magasins pour un territoire donné
 */
export async function loadStoresForTerritory(territoryId) {
  if (!map) return console.error("Map non initialisée");

  // Nettoyer les anciens marqueurs
  markers.forEach((m) => map.removeLayer(m));
  markers = [];

  // Trouver le territoire
  const territory = TERRITORIES.find(t => t.id === territoryId);
  if (!territory) {
    console.error("Territoire introuvable :", territoryId);
    return;
  }

  // Centrer la carte
  map.setView([territory.center.lat, territory.center.lon], 11);

  // Récupération Firestore
  const stores = await getStoresByTerritory(territoryId);

  if (!stores || stores.length === 0) {
    console.warn("Aucun magasin trouvé pour", territoryId);
    return;
  }

  stores.forEach(store => {
    const { lat, lon, name, address, phone } = store;

    if (!lat || !lon) return;

    // Icône personnalisée
    const blueIcon = L.icon({
      iconUrl: "/assets/marker-blue.png",
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -30],
    });

    // Création du marqueur
    const marker = L.marker([lat, lon], { icon: blueIcon }).addTo(map);

    // Popup riche
    const popupHTML = `
      <div class="popup-store">
        <h3>${name}</h3>
        <p><strong>Adresse :</strong> <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" target="_blank">${address}</a></p>
        <p><strong>Tél :</strong> ${phone}</p>

        <button onclick="launchGPS('${encodeURIComponent(address)}')" 
          style="margin-top:10px;padding:8px 12px;border-radius:8px;background:#2563eb;color:white;">
          Ouvrir dans Google Maps
        </button>

        <div id="promo-container-${store.id}" style="margin-top:10px;font-size:14px;color:#ddd;">
          <em>Analyse IA des promotions sur votre trajet…</em>
        </div>
      </div>
    `;

    marker.bindPopup(popupHTML);
    markers.push(marker);
  });
}

/**
 * Fonction GPS (accessible globalement)
 */
window.launchGPS = function(address) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
  window.open(url, "_blank");
};