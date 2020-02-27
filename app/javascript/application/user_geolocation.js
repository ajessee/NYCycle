$(document).ready(function(){

  var errors = $(".errors").hide()
  var main = $(".main")
  $('.address_form').hide()

  //Get user's geolocation and POST to Bins controller
  $('.location').one('click', function(event){

    event.preventDefault();

    $('.logo').children().animate({ "margin-left": ".5em" }, 100 )
    $('.logo').children().animate({ "height": "3em" }, 100 )
    $('.logo').animate({ "margin-top": "0em" }, 1000 );
    if ($(window).width() >= 800){
      $('.main').animate({ "margin-top": "-7em" }, 1000 );
    }
    else {
      $('.main').animate({ "margin-top": "-4em" }, 1000 );
    }
    $( ".location" ).fadeOut();
    $( ".address" ).fadeOut();
    $( ".loader" ).fadeIn();

    whereAmI();

    function whereAmI() {

      if (!navigator.geolocation){
        errors.html("<p>Unfortunately, Geolocation is not supported by your browser. Please enter your address in the form.</p>");
        return;
      }

      function success(position) {
        var user_location = {lat: position.coords.latitude, lng: position.coords.longitude};
        $.ajax({
          url: "/bins/getlatlng",
          method: "post",
          data: user_location
        })
        .done(function(response){
          main.html(response)
        });
      };

      function error(error) {
        $( ".loader" ).hide();
        $(".errors").fadeIn();
        switch(error.code) {
          case error.PERMISSION_DENIED:
          errors.html("Error: User denied the request for Geolocation.")
          break;
          case error.POSITION_UNAVAILABLE:
          errors.html("Error: Location information is unavailable.")
          break;
          case error.TIMEOUT:
          errors.html("Error: The request to get user location timed out.")
          break;
          case error.UNKNOWN_ERROR:
          errors.html("Error: An unknown error occurred.")
          break;
        }
      };

      navigator.geolocation.getCurrentPosition(success, error);
    }

  })
  
  //Hide and show address form
  $('.address').on('click', function(event){
    event.preventDefault();
    if ($('.address_form').is(":hidden")){
      $('.address').text("Cancel")
      $('.logo').animate({"margin-top": "0em"});
      $('.address_form').fadeIn();
    }
    else {
      $('.address').text("Input A NYC Address")
      $('.address_form').fadeOut();
      $('.logo').animate({"margin-top": "8em"});
    }
  })

  //Gets user's geolocation based on address
  $('.success.button').on('click', function(event){
    event.preventDefault();
    $('.logo').children().animate({ "margin-left": ".5em" }, 100 )
    $('.logo').children().animate({ "height": "3em" }, 100 )
    $('.logo').animate({ "margin-top": "0em" }, 1000 );
    if ($(window).width() >= 800){
      $('.main').animate({ "margin-top": "-7em" }, 1000 );
    }
    else {
      $('.main').animate({ "margin-top": "-4em" }, 1000 );
    }
    $( ".location" ).fadeOut();
    $( ".address" ).fadeOut();
    $( ".address_form" ).fadeOut();
    $( ".loader" ).fadeIn();
    

    var data = $(event.target).parent().serialize()

    $.ajax({
      url: "/bins/convert_to_latlng",
      method: "post",
      data: data
    })
    .done(function(response){
      main.html(response);
    });
  });

//Gets map screen
$(document).on("submit", "#map-button", function(event){

  event.preventDefault();
  var data = $(this).serialize();

  $.ajax({
    url: "/bins/getlatlng",
    method: "post",
    data: data
  })
  .done(function(response){
    main.html(response);
  });
});

//Gets walking directions
$(document).on("submit", "#walking-button", function(event){

  event.preventDefault();
  var data = $(this).serialize();

  $.ajax({
    url: "/bins/walking_directions",
    method: "post",
    data: data
  })
  .done(function(response){
    main.html(response);
  });
});

//Gets streetview
$(document).on("submit", "#streetview-button", function(event){

  event.preventDefault();
  var data = $(this).serialize();

  $.ajax({
    url: "/bins/street_view",
    method: "post",
    data: data
  })
  .done(function(response){
    main.html(response);
  });
});
})
