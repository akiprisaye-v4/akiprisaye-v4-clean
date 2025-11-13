// scripts/magasins-firestore.js
// Charge les magasins depuis Firestore : collection "stores"

import { getDB, loadFirestore } from "../firebase-config.js";

let firestoreModule = null;

// Charge Firestore une seule fois
async function getFirestoreModule() {
  if (!firestoreModule) {
    firestoreModule = await loadFirestore();
  }
  return firestoreModule;
}

/**
 * Récupère tous les magasins d’un territoire
 * @param {string} territoryId - ex: "guadeloupe"
 * @returns {Promise<Array>}
 */
export async function getStoresByTerritory(territoryId) {
  if (!territoryId) {
    console.error("❌ Aucun territoire précisé !");
    return [];
  }

  const db = await getDB();
  const firestore = await getFirestoreModule();
  const { collection, getDocs, query, where } = firestore;

  // 🔥 Sélection collection
  const colRef = collection(db, "stores");

  // 🔥 Filtre : "territory" == "guadeloupe"
  const q = query(colRef, where("territory", "==", territoryId));

  let snapshot = null;

  try {
    snapshot = await getDocs(q);
  } catch (err) {
    console.error("❌ Erreur Firestore :", err);
    return [];
  }

  // 🔥 Conversion en tableau lisible par la carte
  const shops = [];

  snapshot.forEach((doc) => {
    const data = doc.data();

    shops.push({
      id: doc.id,

      // Noms différents possibles (compatibilité auto)
      name: data.name || data.Name || "Magasin",
      chain: data.chain || "",

      address: data.address || "",
      lat: Number(data.lat) || null,
      lon: Number(data.lon) || null,

      phone: data.phone || "",
      openingHours: data.openingHours || "",

      territory: data.territory || territoryId,
    });
  });

  console.log(
    `Firestore → ${shops.length} magasins trouvés pour ${territoryId}`
  );

  return shops;
}