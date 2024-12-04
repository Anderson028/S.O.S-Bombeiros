let map, marker, geocoder, autocomplete;

function initMap() {
  geocoder = new google.maps.Geocoder();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map = new google.maps.Map(document.getElementById("map"), {
        center: currentLocation,
        zoom: 15,
      });

      marker = new google.maps.Marker({
        position: currentLocation,
        map: map,
        draggable: true,
      });

      marker.addListener("dragend", () => {
        const newPosition = marker.getPosition();
        updateAddress(newPosition.lat(), newPosition.lng());
      });

      initAutocomplete();
      updateAddress(currentLocation.lat, currentLocation.lng());
    },
    () => {
      alert("Não foi possível acessar a localização. Use o campo de endereço.");
    }
  );
}

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"), {
    types: ["geocode"],
    componentRestrictions: { country: "br" },
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      map.setCenter(location);
      marker.setPosition(location);
    } else {
      alert("Endereço não encontrado.");
    }
  });
}

function updateAddress(lat, lng) {
  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === "OK" && results[0]) {
      document.getElementById("autocomplete").value = results[0].formatted_address;
    } else {
      document.getElementById("autocomplete").value = "Endereço não encontrado";
    }
  });
}

document.getElementById("locate").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const newLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    map.setCenter(newLocation);
    marker.setPosition(newLocation);
    updateAddress(newLocation.lat, newLocation.lng);
  });
});

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

 
  setTimeout(() => notification.classList.remove("show"), 5000);
}

document.getElementById("send").addEventListener("click", () => {
  const address = document.getElementById("autocomplete").value;
  const markerPosition = marker.getPosition();
  showNotification(`Solicitação enviada para: ${address || "Localização marcada no mapa"}`);
});
