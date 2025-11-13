// scripts/magasins-firestore.js
// Chargement des magasins depuis Firestore (collection "stores")

import { getDB, loadFirestore } from "../firebase-config.js";

let firestoreModulePromise = null;

// Charge Firestore (lazy loading)
async function getFirestoreModule() {
  if (!firestoreModulePromise) {
    firestoreModulePromise = loadFirestore();
  }
  return firestoreModulePromise;
}

/**
 * 🔥 Fonction officielle utilisée par load-map.js
 * Récupère les magasins d'un territoire
 */
export async function getStoresByTerritory(territoryId) {
  try {
    const db = await getDB();
    const firestore = await getFirestoreModule();
    const { collection, getDocs, query, where } = firestore;

    const colRef = collection(db, "stores");
    const q = query(colRef, where("territory", "==", territoryId));

    const snapshot = await getDocs(q);

    const shops = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      shops.push({
        id: doc.id,
        name: data.name || data.Name || "Magasin",
        address: data.address || "",
        lat: data.lat,
        lon: data.lon,
        chain: data.chain || "",
        territory: data.territory || territoryId,
        openingHours: data.openingHours || "",
        phone: data.phone || "",
      });
    });

    console.log(
      `Firestore → ${shops.length} magasin(s) trouvés pour ${territoryId}`
    );

    return shops;
  } catch (e) {
    console.error("Erreur Firestore:", e);
    return [];
  }
}