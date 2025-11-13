import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ⚠️ Pas de géocodage tant que geocode() n’est pas créé
export async function autoImportStore(store) {

  const ref = doc(collection(db, "stores"));

  await setDoc(ref, {
    name: store.name,
    address: store.address,
    chain: store.chain,
    lat: store.lat,
    lon: store.lon,
    openingHours: store.openingHours,
    phone: store.phone,
    territory: "guadeloupe"
  });

  console.log("Store ajouté :", store.name);
}