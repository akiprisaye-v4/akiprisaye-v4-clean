console.log("🧪 Vérification des assets…");

const imgs = document.querySelectorAll("img");

imgs.forEach(img => {
  img.onerror = () => {
    console.error("❌ Image introuvable :", img.src);
  };
});