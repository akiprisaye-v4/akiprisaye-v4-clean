/**
 * VERIFY-STORES.MJS
 * Diagnostic complet de la collection Firestore: stores
 * ------------------------------------------------------
 * - Vérification des champs obligatoires
 * - Détection des doublons
 * - Détection des documents corrompus
 * - Vérification des coordonnées GPS
 * - Vérification du code territoire
 *
 * Utilisation :
 * node scripts/verify-stores.mjs
 *
 * Fonctionne sous Node + Cloudflare local + Firebase
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs
} from "firebase/firestore";

// -------------------------------------------------------------
// 🔥 Configuration Firebase (à jour)
// -------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyC4-AsMNI0R3Zay0aK7BomzFzkDKvuHL0wU",
  authDomain: "akiprisaye.firebaseapp.com",
  projectId: "akiprisaye",
  storageBucket: "akiprisaye.appspot.com",
  messagingSenderId: "1046042341538",
  appId: "1:1046042341538:web:468945172af5fa39ae00c6"
};

// -------------------------------------------------------------
// 🔥 Connexion Firebase
// -------------------------------------------------------------
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔍 Vérification des magasins Firestore…");

// -------------------------------------------------------------
// 🧩 Fonction principale
// -------------------------------------------------------------
async function verifyStores() {
  const storesRef = collection(db, "stores");
  const snapshot = await getDocs(storesRef);

  if (snapshot.empty) {
    console.log("❌ Aucun magasin trouvé dans Firestore !");
    return;
  }

  let total = 0;
  let duplicates = new Set();
  let names = new Set();

  let missingCoords = [];
  let missingTerritory = [];
  let corrupted = [];
  let ok = [];

  console.log(`📦 ${snapshot.size} magasins trouvés.\n`);

  snapshot.forEach(doc => {
    total++;
    const store = doc.data();
    const id = doc.id;

    // Champs obligatoires
    const required = ["name", "address", "chain", "territory"];
    const missing = required.filter(f => !store[f]);

    if (missing.length > 0) {
      corrupted.push({ id, missing });
      return;
    }

    // Doublons sur le nom
    if (names.has(store.name)) {
      duplicates.add(store.name);
    } else {
      names.add(store.name);
    }

    // Coordonnées GPS
    if (store.lat == null || store.lon == null) {
      missingCoords.push({ id, name: store.name });
    }

    // Territoire valide
    const t = store.territory.toLowerCase();
    const valid = [
      "guadeloupe",
      "martinique",
      "guyane",
      "reunion",
      "mayotte"
    ];

    if (!valid.includes(t)) {
      missingTerritory.push({ id, territory: store.territory });
    }

    ok.push({ id, name: store.name });
  });

  // -------------------------------------------------------------
  // 📊 Résultat final
  // -------------------------------------------------------------
  console.log("===== 🧪 DIAGNOSTIC COMPLET DES MAGASINS =====\n");

  console.log(`✔ Magasins valides : ${ok.length}`);
  console.log(`❌ Magasins corrompus : ${corrupted.length}`);
  console.log(`⚠ Magasins sans coordonnées : ${missingCoords.length}`);
  console.log(`⚠ Territoires invalides : ${missingTerritory.length}`);
  console.log(`⚠ Doublons détectés : ${duplicates.size}`);

  console.log("\n------ DÉTAILS ------");

  if (corrupted.length) {
    console.log("\n❌ Magasins corrompus :");
    corrupted.forEach(s => console.log(`- ${s.id} → champs manquants: ${s.missing.join(", ")}`));
  }

  if (missingCoords.length) {
    console.log("\n⚠ Magasins sans GPS :");
    missingCoords.forEach(s => console.log(`- ${s.name} (id: ${s.id})`));
  }

  if (missingTerritory.length) {
    console.log("\n⚠ Territoires invalides :");
    missingTerritory.forEach(s => console.log(`- ${s.id} → territoire: ${s.territory}`));
  }

  if (duplicates.size) {
    console.log("\n⚠ Doublons :");
    duplicates.forEach(n => console.log(`- ${n}`));
  }

  console.log("\n🎉 Vérification terminée !");
}

// -------------------------------------------------------------
verifyStores();