let map;

export function initMap(center = { lat: 16.2418, lng: -61.5333 }, zoom = 11) {
    map = new google.maps.Map(document.getElementById("map"), {
        center,
        zoom,
        mapId: "AKI_PRI_MAP_STYLE",
        gestureHandling: "greedy"
    });
    return map;
}

export function addMarker(store) {
    const marker = new google.maps.Marker({
        position: { lat: store.lat, lng: store.lon },
        map: map,
        title: store.name,
        icon: {
            url: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png"
        }
    });

    const content = `
        <div style="font-size:14px;">
            <strong>${store.name}</strong><br>
            ${store.address}<br>
            <small>${store.openingHours || ""}</small><br><br>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lon}"
               target="_blank"
               style="color:#1a73e8;font-weight:bold;">
               🚗 Ouvrir dans Google Maps
            </a>
        </div>
    `;

    const infowindow = new google.maps.InfoWindow({ content });

    marker.addListener("click", () => {
        infowindow.open({ anchor: marker, map });
    });

    return marker;
}