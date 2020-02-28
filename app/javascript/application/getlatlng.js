window.NYCycle.map;

window.NYCycle.initMap = function(user_lat, user_lng, bin_lat, bin_lng) {
  var user = {lat: user_lat, lng: user_lng};
  var bin = {lat: bin_lat, lng: bin_lng};

  window.NYCycle.map = new google.maps.Map(document.getElementById('map'), {
    center: user,
    scrollwheel: false,
    zoom: 7
  });

  var directionsDisplay = new google.maps.DirectionsRenderer({
    map: window.NYCycle.map
  });

  var request = {
    destination: bin,
    origin: user,
    travelMode: google.maps.TravelMode.WALKING
  };

  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {

      directionsDisplay.setDirections(response);
    }
  });
}
