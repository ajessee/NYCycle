# frozen_string_literal: true

class WelcomeController < ApplicationController
  def hello; end

  def fetch_closest_bin
    @user_coordinates = Geokit::LatLng.new(bin_params[:lat].to_f,bin_params[:lng].to_f)
    @bin = Bin.closest(origin: @user_coordinates).first
    @in_NYC = @user_coordinates.distance_to(@bin) < 20
    respond_to do |format|
      format.js {
        render json: {
          binLat: @bin.latitude,
          binLng: @bin.longitude,
          inNYC: @in_NYC
        }
      }
    end
  end

  def fetch_coords_and_bin
    address = bin_params['street'] + ', ' + bin_params['city'] + ', ' + bin_params['zip']
    address_data = Geokit::Geocoders::GoogleGeocoder.geocode address
    @address_coordinates = Geokit::LatLng.new(address_data.lat, address_data.lng)
    @closest_bin = Bin.closest(origin: @address_coordinates).first
    @in_NYC = @address_coordinates.distance_to(@closest_bin) < 20
    respond_to do |format|
      format.js {
        render json: {
          addressLat: @address_coordinates.lat,
          addressLng: @address_coordinates.lng,
          binLat: @closest_bin.latitude,
          binLng: @closest_bin.longitude,
          inNYC: @in_NYC
        }
      }
    end
  end

  private

  def bin_params
    params.require(:welcome).permit(:lat, :lng, :street, :city, :zip)
  end
end
