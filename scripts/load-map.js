/**
 * LOAD-MAP.JS
 * Chargement des magasins depuis Firestore + affichage sur Leaflet
 */

import { getDB } from "./firebase-config.js";

export async function loadStoresForTerritory(territory, map) {
    console.log("📍 Chargement magasins pour :", territory);

    const db = await getDB();

    const { collection, query, where, getDocs } = await import(
        "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
    );

    const q = query(
        collection(db, "stores"),
        where("territory", "==", territory.toLowerCase())
    );

    const snapshot = await getDocs(q);

    console.log(`📦 ${snapshot.size} magasins trouvés pour ${territory}`);

    snapshot.forEach(docSnap => {
        const data = docSnap.data();

        if (!data.lat || !data.lon) {
            console.warn("⚠️ Magasin sans coordonnées :", data);
            return;
        }

        L.marker([data.lat, data.lon])
            .addTo(map)
            .bindPopup(`
                <b>${data.name}</b><br/>
                ${data.address}<br/>
                Chaîne : ${data.chain}<br/>
                Tel : ${data.phone || "n/a"}
            `);
    });

    console.log("✔️ Affichage terminé.");
}