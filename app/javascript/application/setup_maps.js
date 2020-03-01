const setUpMaps = function () {

  const initMap = function (user_lat, user_lng, bin_lat, bin_lng) {
    return new Promise((resolve, reject) => {
      const user = {
        lat: user_lat,
        lng: user_lng
      };
      const bin = {
        lat: bin_lat,
        lng: bin_lng
      };

      const mainMap = new google.maps.Map(document.getElementById('map-container'), {
        center: user,
        scrollwheel: false,
        zoom: 7
      });

      const directionsDisplay = new google.maps.DirectionsRenderer({
        map: mainMap
      });

      const request = {
        destination: bin,
        origin: user,
        travelMode: google.maps.TravelMode.WALKING
      };

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          window.NYCycle.maps.mainMapRendered = true;
          resolve("Map Rendered");
        } else {
          window.NYCycle.maps.mainMapRendered = false;
          reject(status)
        }
      });
    })
  }

  const initStreet = function (binLat, binLng) {
    return new Promise((resolve, reject) => {
      const panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street-view-container'), {
          position: {
            lat: binLat,
            lng: binLng
          },
          pov: {
            heading: 0,
            pitch: 0
          },
          zoom: 1
        });
      // Todo: Figure out if this is proper way to see if panaroma request succeeded
      if (panorama) {
        window.NYCycle.maps.streetViewRendered = true;
        resolve("Street View Rendered");
      } else {
        window.NYCycle.maps.streetViewRendered = false;
        reject("Street View Error")
      }
    })
  }

  const initWalking = function (user_lat, user_lng, bin_lat, bin_lng) {
    return new Promise((resolve, reject) => {
      const user = {
        lat: user_lat,
        lng: user_lng
      };
      const bin = {
        lat: bin_lat,
        lng: bin_lng
      };

      const directionsDisplay = new google.maps.DirectionsRenderer;
      const directionsService = new google.maps.DirectionsService;

      const walkingMap = new google.maps.Map(document.getElementById('walking-directions-map'), {
        zoom: 7,
        center: user
      });

      directionsDisplay.setMap(walkingMap);
      directionsDisplay.setPanel(document.getElementById('walking-directions-container'));

      calculateAndDisplayRoute(directionsService, directionsDisplay);

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        const start = user;
        const end = bin;
        directionsService.route({
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.WALKING
        }, function (response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            window.NYCycle.maps.walkingDirectionsRendered = true;
            resolve("Walking Directions Rendered");
          } else {
            window.NYCycle.maps.walkingDirectionsRendered = false;
            reject(status);
          }
        });
      }
    })
  }
  
  window.NYCycle.maps = {};
  window.NYCycle.maps.initMap = initMap;
  window.NYCycle.maps.initWalking = initWalking;
  window.NYCycle.maps.initStreet = initStreet;

}

document.addEventListener("DOMContentLoaded", setUpMaps);