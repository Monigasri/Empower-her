let map;
let dangerMarkers = [];
let safeMarkers = [];

function initMap() {
    // Default map center
    const center = { lat: 45.0703, lng: 7.6869 }; // Example: Torino, Italy
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 15,
    });

    // Search Box
    const input = document.getElementById("search");
    const searchBox = new google.maps.places.SearchBox(input);
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    // Place danger area markers (Example points)
    const dangerPoints = [
        { lat: 45.072, lng: 7.682 },
        { lat: 45.069, lng: 7.689 },
    ];

    dangerPoints.forEach((location) => {
        const marker = new google.maps.Marker({
            position: location,
            map,
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            title: "Danger Zone",
        });
        dangerMarkers.push(marker);
    });

    // Place safe area markers (Example points)
    const safePoints = [
        { lat: 45.074, lng: 7.687 },
        { lat: 45.068, lng: 7.685 },
    ];

    safePoints.forEach((location) => {
        const marker = new google.maps.Marker({
            position: location,
            map,
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            title: "Safe Zone",
        });
        safeMarkers.push(marker);
    });

    // Search place selection
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length == 0) return;
        const place = places[0];
        map.setCenter(place.geometry.location);
        map.setZoom(16);
    });
}

window.onload = initMap;
