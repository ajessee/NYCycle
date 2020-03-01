const setUpApp = function () {

  const mainApp = {

    mainContainer: document.querySelector('#main-container'),
    logoContainer: document.querySelector('#logo-container'),
    logoLink: document.querySelector('#logo-link'),
    mainButtonsContainer: document.querySelector('#main-buttons-container'),
    userLocationButton: document.querySelector('#user-location'),
    addressLocationButton: document.querySelector('#address-location'),
    selectionsButtonsContainer: document.querySelector('#selection-buttons-container'),
    mapButton: document.querySelector('#map-button'),
    walkingDirectionsButton: document.querySelector('#walking-directions-button'),
    streetViewButton: document.querySelector('#street-view-button'),
    contentContainer: document.querySelector('#content-container'),
    mapContainer: document.querySelector('#map-container'),
    walkingDirectionContainer: document.querySelector('#walking-directions-container'),
    streetViewContainer: document.querySelector('#street-view-container'),
    addressInputContainer: document.querySelector('#address-input-container'),
    addressInputForm: document.querySelector('#address-input-form'),
    spinnerContainer: document.querySelector('#logo-circle'),
    messageContainer: document.querySelector('#message-container'),
    csrfToken: document.querySelector('meta[name="csrf-token"]').content,
    binLat: null,
    binLng: null,
    userLat: null,
    userLng: null,
    inNYC: null,

    // Get user's geolocation
    whereAmI: function () {
      let app = this;

      return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {
          app.toggleMessage(true, 'Unfortunately, Geolocation is not supported by your browser. Please enter your address in the form.', 'error')
          return;
        }

        function success(position) {
          app.userLat = position.coords.latitude;
          app.userLng = position.coords.longitude;
          var userLocation = {
            lat: app.userLat,
            lng: app.userLng
          };
          fetch('/welcome/fetch_closest_bin', {
              method: 'POST',
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': app.csrfToken,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(userLocation)
            })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              app.binLat = data.binLat;
              app.binLng = data.binLng;
              app.inNYC = data.in_NYC;
              resolve("Bin Data Set");
            });
        };

        function error(error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              app.toggleMessage(true, 'Looks like you denied access to your geolocation. Please use address form instead' , 'error');
              app.toggleSpinner(false);
              break;
            case error.POSITION_UNAVAILABLE:
              app.toggleMessage(true, 'Your location information is unavaiable. Please use address form instead' , 'error');
              app.toggleSpinner(false);
              break;
            case error.TIMEOUT:
              app.toggleMessage(true, 'The request to get your location timed out. Please use address form instead' , 'error');
              app.toggleSpinner(false);
              break;
            case error.UNKNOWN_ERROR:
              app.toggleMessage(true, 'Weird. We have an error that we cannot figure out. Please use address form instead' , 'error');
              app.toggleSpinner(false);
          }
          reject("Geolocation Error")
        };

        navigator.geolocation.getCurrentPosition(success, error);
      })
    },

    //Gets geolocation based on address
    whereIsThis: function (addressForm) {
      let self = this;
      return new Promise((resolve, reject) => {
        let address = {
          street: addressForm.querySelector('#street-input').value,
          city: addressForm.querySelector('#city-input').value,
          zip: addressForm.querySelector('#zip-input').value
        }

        fetch('/welcome/fetch_coords_and_bin', {
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRF-Token': self.csrfToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(address)
          })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            self.binLat = data.binLat;
            self.binLng = data.binLng;
            self.userLat = data.addressLat;
            self.userLng = data.addressLng;
            resolve("Address and User Location Set");
          })
          .catch(function (exception) {
            reject(exception);
          });
      })

    },

    //Hide and show address form
    toggleAddressForm: function (immediate) {
      let app = window.NYCycle.mainApp;
      if (immediate) {
        app.addressInputContainer.style.display = 'none';
        return;
      };
      if (app.addressInputContainer.classList.contains('visible')) {
        app.mainContainer.classList.remove('address-visible');
        app.addressInputContainer.classList.remove('visible');
        app.addressLocationButton.style.backgroundColor = '#1779ba';
        app.addressLocationButton.textContent = 'Input A NYC Address';
      } else {
        app.mainContainer.classList.add('address-visible');
        app.addressInputContainer.classList.add('visible');
        app.addressLocationButton.style.backgroundColor = '#de4d43';
        app.addressLocationButton.textContent = 'Cancel';
      }
    },

    addLinkToLogo: function () {
      let app = window.NYCycle.mainApp;
      app.logoLink.href="javascript:location.reload(true)"
      app.logoLink.classList.remove('disabled');
      app.logoLink.classList.add('enabled');
    },

    getMainMap: function () {
      let app = window.NYCycle.mainApp;
      window.NYCycle.maps.initMap(app.userLat, app.userLng, app.binLat, app.binLng)
        .then(function () {
          app.setMapsReadyState();
        })
        .catch(function (exception) {
          console.log(exception)
        });
    },

    setMapsReadyState: function () {
      let app = window.NYCycle.mainApp;
      // Turn of spinner
      app.toggleSpinner(false);
      // Hide info panel
      app.toggleMessage(false);
      // Size main container for maps
      app.mainContainer.classList.add('maps-visible');
      // Size logo for maps
      app.logoContainer.classList.add('maps-visible');
      // Add link to logo
      app.addLinkToLogo();
      // Hide main buttons
      app.mainButtonsContainer.classList.add('maps-visible');
      // Show nav buttons
      app.selectionsButtonsContainer.classList.add('maps-visible');
      // Show content area
      app.contentContainer.classList.add('visible');
      // Show main mapp area
      app.mapContainer.classList.add('visible');
    },

    toggleSpinner: function (on) {
      let app = window.NYCycle.mainApp;
      if (on) {
        app.spinnerContainer.classList.add('spin');
      } else {
        app.spinnerContainer.classList.remove('spin');
      }
    },

    getMap: function () {
      let app = window.NYCycle.mainApp;
      let maps = window.NYCycle.maps;
      let hideElements = function () {
        app.toggleSpinner(false);
        app.walkingDirectionContainer.classList.remove('visible');
        app.streetViewContainer.classList.remove('visible');
      };
      let showElements = function () {
        app.toggleSpinner(false);
        app.mapContainer.classList.add('visible');
        app.streetViewContainer.classList.remove('visible');
        app.walkingDirectionContainer.classList.remove('visible');
      };
      if (app.mapContainer.classList.contains('visible')) {
        hideElements();
      } else {
        if (!maps.mainMapRendered) {
          maps.initMap(app.userLat, app.userLng, app.binLat, app.binLng)
            .then(showElements)
            .catch(function (exception) {
              console.log(exception)
            });
        } else {
          showElements();
        }
      }
    },

    getWalkingDirections: function () {
      let app = window.NYCycle.mainApp;
      let maps = window.NYCycle.maps;
      let hideElements = function () {
        app.toggleSpinner(false);
        app.mapContainer.classList.remove('visible');
        app.streetViewContainer.classList.remove('visible');
      };
      let showElements = function () {
        app.toggleSpinner(false);
        app.walkingDirectionContainer.classList.add('visible');
        app.streetViewContainer.classList.remove('visible');
        app.mapContainer.classList.remove('visible');
      };
      if (mainApp.walkingDirectionContainer.classList.contains('visible')) {
        hideElements();
      } else {
        if (!maps.walkingDirectionsRendered) {
          maps.initWalking(app.userLat, app.userLng, app.binLat, app.binLng)
            .then(showElements)
            .catch(function (exception) {
              console.log(exception)
            });
        } else {
          showElements();
        }

      }
    },

    getStreetView: function () {
      let app = window.NYCycle.mainApp;
      let maps = window.NYCycle.maps;
      let hideElements = function () {
        app.toggleSpinner(false);
        app.mapContainer.classList.remove('visible');
        app.walkingDirectionContainer.classList.remove('visible');
      };
      let showElements = function () {
        app.toggleSpinner(false);
        app.streetViewContainer.classList.add('visible');
        app.mapContainer.classList.remove('visible');
        app.walkingDirectionContainer.classList.remove('visible');
      };
      if (app.streetViewContainer.classList.contains('visible')) {
        hideElements();
      } else {
        if (!maps.streetViewRendered) {
          maps.initStreet(app.binLat, app.binLng)
            .then(showElements)
            .catch(function (exception) {
              console.log(exception)
            });
        } else {
          showElements();
        }
      }
    },

    toggleMessage: function (on, message = null, state = null) {
      let app = window.NYCycle.mainApp;
      app.messageContainer.classList.remove('visible');
      app.messageContainer.classList.add('hidden');
      if (app.messageContainer.firstElementChild) {
        app.messageContainer.firstElementChild.remove();
      }

      if (!on) {
        return;
      }

      let textColor, backgroundColor, icon, textClass;
      let messageDiv = document.createElement('div');
      let messageTextContainer = document.createElement('p');
      switch (state) {
        case "info":
          icon = '<i class="fas fa-info-circle" style="color: red;"></i>';
          textColor = 'black'
          backgroundColor = 'yellow'
          textClass = 'info'
          break;
        case "error":
          icon = '<i class="fas fa-exclamation-triangle" style="color: white;"></i>';
          textColor = 'white';
          backgroundColor = 'red'
          textClass = 'error'
          break;
        case "request":
          icon = '<i class="fas fa-hiking" style="color: gray;"></i>';
          textColor = 'black';
          backgroundColor = 'transparent'
          textClass = 'blinking'
          break;
        default:
          break;
      }
      messageTextContainer.textContent = message;
      messageTextContainer.style.color = textColor;
      messageTextContainer.classList.add(textClass);
      messageDiv.innerHTML = icon;
      messageDiv.appendChild(messageTextContainer);
      messageDiv.style.backgroundColor = backgroundColor;
      messageDiv.setAttribute('id', 'message-div')
      app.messageContainer.appendChild(messageDiv);
      app.messageContainer.classList.remove('hidden');
      app.messageContainer.classList.add('visible');
    },

    setPendingState: function () {
      let app = window.NYCycle.mainApp;
      // Turn on spinner
      app.toggleSpinner(true);
      // Show info panel
      app.toggleMessage(true, 'Getting maps...', 'request');
    },




  }

  mainApp.mapButton.addEventListener('click', function (e) {
    mainApp.toggleSpinner(true);
    mainApp.getMap();
  })

  mainApp.walkingDirectionsButton.addEventListener('click', function (e) {
    mainApp.toggleSpinner(true);
    mainApp.getWalkingDirections();
  })

  mainApp.streetViewButton.addEventListener('click', function (e) {
    mainApp.toggleSpinner(true);
    mainApp.getStreetView();
  })

  mainApp.addressInputForm.addEventListener('submit', function (e) {
    e.preventDefault();
    mainApp.toggleAddressForm(true);
    mainApp.setPendingState();
    mainApp.whereIsThis(mainApp.addressInputForm)
      .then(mainApp.getMainMap)
      .catch(function (exception) {
        console.log(exception)
      })
  })

  mainApp.userLocationButton.addEventListener('click', function (e) {
    mainApp.setPendingState();
    mainApp.whereAmI()
      .then(mainApp.getMainMap)
      .catch(function (exception) {
        console.log(exception)
      })
  })

  mainApp.addressLocationButton.addEventListener('click', function (e) {
    mainApp.toggleMessage(false);
    mainApp.toggleAddressForm();
  })

  window.NYCycle.mainApp = mainApp;

}

document.addEventListener("DOMContentLoaded", setUpApp);