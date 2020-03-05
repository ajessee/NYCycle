# frozen_string_literal: true

class WelcomeController < ApplicationController
  def hello; end

  def fetch_closest_bin
    @user_coordinates = Geokit::LatLng.new(bin_params[:lat].to_f, bin_params[:lng].to_f)
    @bin = Bin.closest(origin: @user_coordinates).first
    @user_distance_to_bin = @user_coordinates.distance_to(@bin).round
    @in_NYC = @user_coordinates.distance_to(@bin) < 20
    if !@in_NYC
      @landmarks = Landmark.all
      @message_html = render_to_string(
        partial: 'outside',
        formats: :html,
        layout: false,
        locals: { distance_to_bin: @user_distance_to_bin, landmarks: @landmarks }
      )
    end
    respond_to do |format|
      format.js {
        render json: {
          binLat: @bin.latitude,
          binLng: @bin.longitude,
          distanceToBin: @user_distance_to_bin,
          inNYC: @in_NYC,
          html: @message_html
        }
      }
    end
  end

  def fetch_closest_bin_to_landmark
    @landmark = Landmark.find_by(id: bin_params[:landmark_id])
    @landmark_coordinates = Geokit::LatLng.new(@landmark.latitude, @landmark.longitude)
    @bin = Bin.closest(origin: @landmark_coordinates).first
    respond_to do |format|
      format.js {
        render json: {
          binLat: @bin.latitude,
          binLng: @bin.longitude,
          landmarkLat: @landmark.latitude,
          landmarkLng: @landmark.longitude
        }
      }
    end
  end

  def fetch_coords_and_bin
    bin_params[:city] = 'New York' if bin_params[:city].empty?
    address = bin_params['street'] + ', ' + bin_params['city'] + ', ' + bin_params['zip']
    address_data = Geokit::Geocoders::GoogleGeocoder.geocode address
    @address_coordinates = Geokit::LatLng.new(address_data.lat, address_data.lng)
    @closest_bin = Bin.closest(origin: @address_coordinates).first
    @user_distance_to_bin = @address_coordinates.distance_to(@closest_bin)
    @in_NYC = @address_coordinates.distance_to(@closest_bin) < 20
    respond_to do |format|
      format.js {
        render json: {
          addressLat: @address_coordinates.lat,
          addressLng: @address_coordinates.lng,
          binLat: @closest_bin.latitude,
          binLng: @closest_bin.longitude,
          distanceToBin: @user_distance_to_bin,
          inNYC: @in_NYC
        }
      }
    end
  end

  private

  def bin_params
    params.require(:welcome).permit(:lat, :lng, :street, :city, :zip, :landmark_id)
  end
end
