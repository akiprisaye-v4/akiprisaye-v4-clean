import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';

/**
 * Module Scanner Code-Barres v4.0 - Production Ready
 * Scan camera (EAN-13/EAN-8), image upload, manual entry
 * Mobile-first, handles permissions, QR detection, reflections
 */

export default function ScanOCR() {
  // Camera scanning state
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  // Results state
  const [scannedCode, setScannedCode] = useState('');
  const [isQRCode, setIsQRCode] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  
  // Image upload state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  
  // Manual entry state
  const [manualCode, setManualCode] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Fixed UX messages as per requirements
  const MESSAGES = {
    QR_DETECTED: "Ce QR code ne correspond pas à un code produit. Veuillez scanner le code-barres (traits verticaux) ou saisir le code manuellement.",
    IMAGE_FAILED: "Le code-barres n'a pas pu être détecté (reflets ou angle). Essayez la saisie manuelle.",
    PERMISSION_DENIED: "L'accès à la caméra est nécessaire pour scanner un produit."
  };

  // Initialize ZXing reader with EAN formats only (priority)
  useEffect(() => {
    const hints = new Map();
    // EAN-13 and EAN-8 are mandatory formats
    const formats = [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.QR_CODE // Detect but don't use for product lookup
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);
    
    codeReaderRef.current = new BrowserMultiFormatReader(hints);
    
    return () => {
      stopScanning();
    };
  }, []);

  // Start camera scanning with continuous autofocus
  const startScanning = async () => {
    try {
      setPermissionDenied(false);
      setIsQRCode(false);
      setScannedCode('');
      setImageError(false);
      
      // Get video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        setHasCamera(false);
        return;
      }

      // Find rear camera (environment facing) for better barcode scanning
      const rearCamera = videoDevices.find(device => 
        /back|rear|environment/i.test(device.label)
      );
      const deviceId = rearCamera?.deviceId || videoDevices[0]?.deviceId;

      // Request camera permission with high resolution and autofocus
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          focusMode: { ideal: 'continuous' }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);

        // Start continuous scanning
        codeReaderRef.current.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              const code = result.getText();
              const format = result.getBarcodeFormat();
              
              // Check if it's a QR code - show message but don't process as product
              if (format === BarcodeFormat.QR_CODE) {
                setIsQRCode(true);
                setScannedCode(code);
                stopScanning();
              } else {
                // Valid product barcode (EAN/UPC)
                setScannedCode(code);
                setIsQRCode(false);
                stopScanning();
                fetchProductByEAN(code);
              }
            }
          }
        );
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
      } else {
        setHasCamera(false);
      }
    }
  };

  // Stop camera scanning
  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setIsScanning(false);
  };

  // Handle image upload with reflection/blur handling
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError(false);
    setUploadedImage(URL.createObjectURL(file));
    setIsQRCode(false);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const result = await codeReaderRef.current.decodeFromImageElement(img);
      const code = result.getText();
      const format = result.getBarcodeFormat();
      
      // Check if it's a QR code
      if (format === BarcodeFormat.QR_CODE) {
        setIsQRCode(true);
        setScannedCode(code);
      } else {
        // Valid product barcode
        setScannedCode(code);
        setIsQRCode(false);
        fetchProductByEAN(code);
      }
    } catch (err) {
      console.error('Image decode error:', err);
      setImageError(true);
      // Auto-suggest manual entry on failure
      setShowManualEntry(true);
    }
  };

  // Fetch product information by EAN
  const fetchProductByEAN = async (ean) => {
    try {
      setLoadingProduct(true);
      setProductInfo(null);
      
      // Try to fetch from local price database
      const res = await fetch(`/data/prices.json`, { cache: 'no-store' });
      const data = await res.json();
      const found = data.find((p) => p.ean === ean);
      
      if (found) {
        setProductInfo({
          name: found.name,
          price: found.price,
          store: found.store,
          ean: ean,
          date: new Date().toLocaleString('fr-FR')
        });
      } else {
        setProductInfo({
          name: 'Produit non répertorié',
          price: 'N/A',
          store: 'Aucune donnée disponible',
          ean: ean,
          date: new Date().toLocaleString('fr-FR')
        });
      }
    } catch (err) {
      console.error('Product fetch error:', err);
      setProductInfo({
        name: 'Erreur de chargement',
        price: 'N/A',
        store: 'Service temporairement indisponible',
        ean: ean,
        date: new Date().toLocaleString('fr-FR')
      });
    } finally {
      setLoadingProduct(false);
    }
  };

  // Handle manual entry with immediate validation
  const handleManualSubmit = (e) => {
    e.preventDefault();
    const code = manualCode.trim();
    
    // Validate EAN format (8-13 digits)
    if (/^\d{8,13}$/.test(code)) {
      setScannedCode(code);
      setIsQRCode(false);
      setImageError(false);
      fetchProductByEAN(code);
      setManualCode('');
      setShowManualEntry(false);
    }
  };

  // Open device camera settings (platform-specific guidance)
  const openCameraSettings = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = "Pour activer la caméra :\n\n";
    
    if (isIOS) {
      instructions += "iOS :\n1. Ouvrez Réglages\n2. Recherchez votre navigateur (Safari/Chrome)\n3. Activez l'accès à la Caméra";
    } else if (isAndroid) {
      instructions += "Android :\n1. Ouvrez Paramètres\n2. Applications\n3. Sélectionnez votre navigateur\n4. Autorisations\n5. Activez la Caméra";
    } else {
      instructions += "Bureau :\n1. Cliquez sur l'icône de cadenas/info dans la barre d'adresse\n2. Cherchez 'Caméra'\n3. Autorisez l'accès";
    }
    
    alert(instructions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <span>📱</span>
            Scanner de Code-Barres
          </h1>
          <p className="text-blue-200">
            Scannez les produits pour comparer les prix en Outre-mer
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Camera Scanner Section */}
            {hasCamera && !permissionDenied && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  {!isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <button
                        onClick={startScanning}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105"
                      >
                        <span className="text-2xl mr-2">📷</span>
                        Démarrer le scanner
                      </button>
                    </div>
                  )}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Scanning overlay with targeting box */}
                      <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-48 border-4 border-red-500 rounded-xl shadow-2xl">
                          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-8 border-l-8 border-red-400 rounded-tl-xl"></div>
                          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-8 border-r-8 border-red-400 rounded-tr-xl"></div>
                          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-8 border-l-8 border-red-400 rounded-bl-xl"></div>
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-8 border-r-8 border-red-400 rounded-bl-xl"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-0 right-0 text-center">
                        <span className="inline-block bg-black/80 text-white px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm">
                          <span className="animate-pulse">📡</span> Scan en cours... Positionnez le code-barres
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {isScanning && (
                  <button
                    onClick={stopScanning}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    ⏹ Arrêter le scanner
                  </button>
                )}
              </div>
            )}

            {/* Permission Denied Message */}
            {permissionDenied && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🚫</span>
                  <div className="flex-1">
                    <p className="text-red-900 dark:text-red-200 font-semibold mb-3 text-lg">
                      {MESSAGES.PERMISSION_DENIED}
                    </p>
                    <button
                      onClick={openCameraSettings}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm inline-flex items-center gap-2"
                    >
                      <span>⚙️</span>
                      Ouvrir les paramètres caméra
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* No Camera Available */}
            {!hasCamera && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <p className="text-yellow-900 dark:text-yellow-200 font-medium">
                    Aucune caméra détectée. Utilisez l'import d'image ou la saisie manuelle.
                  </p>
                </div>
              </div>
            )}

            {/* QR Code Detected Message - No product processing */}
            {isQRCode && scannedCode && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📱</span>
                  <div className="flex-1">
                    <p className="text-orange-900 dark:text-orange-200 font-semibold mb-3">
                      {MESSAGES.QR_DETECTED}
                    </p>
                    <button
                      onClick={() => {
                        setIsQRCode(false);
                        setScannedCode('');
                        setShowManualEntry(true);
                      }}
                      className="text-orange-700 dark:text-orange-400 underline hover:text-orange-800 dark:hover:text-orange-300 font-medium"
                    >
                      → Ouvrir la saisie manuelle
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Image Scan Error Message */}
            {imageError && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <p className="text-yellow-900 dark:text-yellow-200 font-semibold">
                      {MESSAGES.IMAGE_FAILED}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 font-semibold">
                  ou
                </span>
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block">
                <span className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">
                  📸 Importer une photo du code-barres
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-700 dark:text-gray-300
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-lg file:border-0
                    file:text-sm file:font-bold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700
                    file:cursor-pointer
                    cursor-pointer border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2"
                />
              </label>
              {uploadedImage && (
                <div className="mt-4">
                  <img
                    src={uploadedImage}
                    alt="Image importée"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Manual Entry Section */}
            <div className="border-2 border-gray-300 dark:border-gray-600 rounded-xl p-5">
              {!showManualEntry ? (
                <button
                  onClick={() => setShowManualEntry(true)}
                  className="w-full border-2 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  ⌨️ Saisie manuelle du code
                </button>
              ) : (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <label className="block">
                    <span className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                      ⌨️ Saisir le code manuellement
                    </span>
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="3290370050126"
                      pattern="\d{8,13}"
                      maxLength="13"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-lg font-mono"
                      required
                    />
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Code EAN à 8-13 chiffres (exemple: 3290370050126)
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      ✓ Valider
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowManualEntry(false);
                        setManualCode('');
                      }}
                      className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Scanned Result Display */}
            {scannedCode && !isQRCode && (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400 mb-2 font-semibold">
                      ✓ Code-barres détecté
                    </p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100 font-mono">
                      {scannedCode}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setScannedCode('');
                      setIsQRCode(false);
                      setProductInfo(null);
                      setUploadedImage(null);
                    }}
                    className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Product Information */}
                {loadingProduct && (
                  <div className="flex items-center gap-3 text-blue-700 dark:text-blue-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 dark:border-blue-400"></div>
                    <span className="font-medium">Recherche du produit...</span>
                  </div>
                )}
                
                {productInfo && !loadingProduct && (
                  <div className="mt-4 bg-white dark:bg-slate-700 rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Produit</span>
                        <p className="text-gray-900 dark:text-white font-semibold">{productInfo.name}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Prix</span>
                        <p className="text-gray-900 dark:text-white font-bold text-lg">{productInfo.price}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Magasin</span>
                        <p className="text-gray-900 dark:text-white">{productInfo.store}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Dernière mise à jour</span>
                        <p className="text-gray-900 dark:text-white text-sm">{productInfo.date}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instructions footer */}
        <div className="mt-6 bg-blue-900/30 backdrop-blur-sm rounded-xl p-6 text-blue-100">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <span>💡</span>
            Conseils pour un scan optimal
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Assurez-vous d'avoir un bon éclairage</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Positionnez le code-barres à 10-20 cm de la caméra</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Maintenez le téléphone stable pendant 1-2 secondes</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Pour les bouteilles en verre, évitez les reflets</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
