function initMap () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function success(position) {
    const currCoords = { lat: position.coords.latitude, lng: position.coords.longitude }
        map = createMap(currCoords),
        marker = createMarker(currCoords, map);
}

function error() {
    console.log('error');
}

function formatCoords (data) {
    return `${data.lat},${data.lng}`;
}

function createMap(coords) {
    return new google.maps.Map(document.getElementById('map'), {
        center: coords,
        zoom: 16,
    });
}

function createMarker(coords, map) {
    const LS_Service = new LocalStorage(),
        marker = new google.maps.Marker({
            position: coords,
            map: map,
            draggable: true,
        });

    google.maps.event.addListener(marker, 'dragend', function (marker) {
        LS_Service.set_LS(
            formatCoords({ lat: marker.latLng.lat(), lng: marker.latLng.lng() }),
            'ubicacion_actual'
        );
    });
}
