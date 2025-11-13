// ---------------------------------------------
// Google Maps + Firestore loader
// ---------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ---------------------------------------------
// Firebase config
// ---------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyAs0uisnGSK7OIrFqQPFYF6E-ctNOPY0Sw",
    authDomain: "a-ki-pri-sa-ye.firebaseapp.com",
    projectId: "a-ki-pri-sa-ye",
    storageBucket: "a-ki-pri-sa-ye.appspot.com",
    messagingSenderId: "379907916421",
    appId: "1:379907916421:web:3f16c0a862ed7ced362175"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------------------------------------------
// Variables globales Google Maps
// ---------------------------------------------
let map;
let markers = [];
let userPosition = null;

// ---------------------------------------------
// Initialisation de la map
// ---------------------------------------------
window.initMap = async function () {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 16.265, lng: -61.551 }, // Centre Guadeloupe par défaut
        mapId: "DEMO_MAP_ID"
    });

    // Récup position utilisateur pour GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            userPosition = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
        });
    }

    console.log("Carte Google Maps initialisée !");
};

// ---------------------------------------------
// Chargement des magasins selon le territoire
// ---------------------------------------------
export async function loadTerritory(territoryId) {

    // Nettoyage des anciens marqueurs
    markers.forEach(m => m.setMap(null));
    markers = [];

    let q;

    if (territoryId === "all") {
        q = query(collection(db, "stores"));
    } else {
        q = query(collection(db, "stores"), where("territory", "==", territoryId));
    }

    const snap = await getDocs(q);

    snap.forEach(doc => {
        const store = doc.data();
        placeMarker(store);
    });

    console.log("Magasins chargés pour :", territoryId);
}

// ---------------------------------------------
// Création d’un marqueur + popup + bouton GPS
// ---------------------------------------------
function placeMarker(store) {

    if (!store.lat || !store.lon) return;

    const marker = new google.maps.Marker({
        position: { lat: store.lat, lng: store.lon },
        map,
        title: store.name
    });

    markers.push(marker);

    // Popup d’info
    const info = new google.maps.InfoWindow({
        content: `
            <div>
                <h3>${store.name}</h3>
                <p>${store.address}</p>

                <button style="
                    padding: 8px 12px;
                    background:#1a73e8;
                    color:white;
                    border-radius:8px;
                    border:none;
                    margin-top:8px;
                " onclick="startGPS(${store.lat}, ${store.lon})">
                    📍 Démarrer GPS
                </button>

                <div id="promo-${store.id}">
                    🔍 Recherche des promotions…
                </div>
            </div>
        `
    });

    marker.addListener("click", () => {
        info.open(map, marker);
        checkPromotionsNear(store);
    });
}

// ---------------------------------------------
// GPS : ouvre Google Maps navigation
// ---------------------------------------------
window.startGPS = function (lat, lon) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    window.open(url, "_blank");
};

// ---------------------------------------------
// Analyse IA : promotions sur la route
// ---------------------------------------------
async function checkPromotionsNear(store) {

    const promoDiv = document.getElementById(`promo-${store.id}`);
    if (!promoDiv) return;

    promoDiv.innerHTML = "⏳ Analyse IA en cours…";

    // 🔥 Exemple simple, tu pourras connecter ton module IA plus tard
    setTimeout(() => {
        promoDiv.innerHTML = `
            🎁 <b>Bon plan sur la route !</b><br>
            - -20% sur produits frais chez Carrefour Express<br>
            - 3 achetés = 1 offert chez Leader Price
        `;
    }, 1200);
}