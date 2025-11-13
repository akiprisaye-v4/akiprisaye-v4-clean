/* ==========================================================
   SCANNER – VERSION PRO
   Compatible Samsung S24+, Android 16, iOS, Cloudflare Pages
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const video = document.getElementById("video");
    const scanResult = document.getElementById("scanResult");
    const cameraLoader = document.getElementById("camera-loader");

    const manualInput = document.getElementById("manualCode");
    const manualBtn = document.getElementById("manualBtn");

    // ZXing Reader
    const codeReader = new ZXing.BrowserMultiFormatReader();

    /* ---------------------------------------------------------
       1. OUVERTURE DE LA CAMÉRA (AUTO / SÉCURISÉE)
       --------------------------------------------------------- */
    async function startCamera() {
        try {
            cameraLoader.style.display = "block";

            const devices = await ZXing.BrowserMultiFormatReader.listVideoInputDevices();

            if (devices.length === 0) {
                scanResult.innerHTML = "❌ Aucune caméra détectée.";
                return;
            }

            // Choix caméra arrière si disponible
            const backCam = devices.find(d => d.label.toLowerCase().includes("back"));
            const camToUse = backCam ? backCam.deviceId : devices[0].deviceId;

            await codeReader.decodeFromVideoDevice(camToUse, video, (result, err) => {
                if (result) {
                    handleScanResult(result.text);
                }
            });

            cameraLoader.style.display = "none";

        } catch (e) {
            cameraLoader.style.display = "none";
            scanResult.innerHTML = "⚠️ Impossible d'accéder à la caméra.<br>Essayez la recherche manuelle ci-dessous.";
            console.error("Erreur caméra:", e);
        }
    }

    /* ---------------------------------------------------------
       2. TRAITEMENT DU CODE SCANNÉ
       --------------------------------------------------------- */
    function handleScanResult(code) {
        scanResult.innerHTML = `
            <div class="scan-found">
                <strong>Code détecté :</strong> ${code}
                <br>
                Recherche du prix en cours…
            </div>
        `;

        // Future synchro Firestore → pour l’instant on simule local
        const product = window.PRODUCTS.find(p => p.id === code || p.barcode === code);

        if (!product) {
            scanResult.innerHTML = `
                <div class="scan-not-found">
                    ❌ Produit non trouvé dans la base.
                    <br>
                    Essayez avec un autre article.
                </div>
            `;
            return;
        }

        scanResult.innerHTML = `
            <div class="scan-product">
                <h3>${product.name}</h3>
                <p>${product.brand}</p>

                <div class="price-block">
                    <span class="price">${product.price.toFixed(2)} €</span>
                    <span class="store">${product.store}</span>
                    <span class="territory">${product.territory}</span>
                </div>
            </div>
        `;
    }

    /* ---------------------------------------------------------
       3. RECHERCHE MANUELLE SI CAMERA KO
       --------------------------------------------------------- */
    manualBtn.addEventListener("click", () => {
        const code = manualInput.value.trim();
        if (!code) return;

        handleScanResult(code);
    });

    /* ---------------------------------------------------------
       4. INIT AUTO
       --------------------------------------------------------- */
    startCamera();
});