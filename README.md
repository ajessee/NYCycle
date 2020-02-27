![NYCycle](https://github.com/utahrim/Re/blob/master/app/assets/images/nycycle.png)

# [NYCycle](https://nycycle-1.herokuapp.com/) 

NYCycle is a web application that uses geolocation technology to allow you to locate the nearest recycling bin in NYC. Using data on bins from [NYC Open Data](https://nycopendata.socrata.com/), the user's location from their browser, and maps from the Google Maps API, we make it easy for people to do their part to reduce, reuse, and recycle. 

You can use NYCycle to find the closest recycling bin to your geolocation or find closest recycling bin to a street address that you provide. Once you submit your choice, the app will render a street map that marks both your and the bin's location, walking directions to the bin's location, and a street view of the location of the bin.

The app is written in Rails 4 and currently deployed in production using Heroku. 

## Features:

* Mobile-first design.
* Single page application.
* Geolocation using mobile phone or browser.
* Spinner appears during AJAX request to let user know that map is loading.

## Future Features:

* Ability to display multiple recycling bins at once in relation to user.
* Add in additional sources of data including recycling centers, compost pick-up, and e-waste recycling.

## Technical Specifications:

* Written in Rails 6.
* Hosted on Heroku, using PostgresQL database to store the latitude and longitude of NYC recycling bins.
* Database is seeded using API call to [NYC Open Data](https://nycopendata.socrata.com/) with API key stored in Heroku environment variables.
* Uses browser or phone's navigator.geolocation API to get latitude and longitude of user's position.
* Error handling in cases of geolocation not available, user denying permissions, request timeout, and other unknown errors.
* Uses Geokit Rails gem to calculate distance and find closest recycling bin to user's location or inputted address.
* Submits geolocation of user and closest bin to Google Maps API using API key stored in Heroku environment variables.
* Requests map with both points, as well as walking directions and street view, renders these elements for user.
* Uses Foundation 6 framework for front end design.
