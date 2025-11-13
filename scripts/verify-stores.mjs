import fs from "fs";

console.log("🧪 Vérification JSON stores…");

const raw = fs.readFileSync("./stores.json", "utf8");
const stores = JSON.parse(raw);

stores.forEach(s => {
  if (!s.lat || !s.lng) {
    console.log("❌ Manque coordonnées :", s.name);
  }
});

console.log("✔ Test terminé");