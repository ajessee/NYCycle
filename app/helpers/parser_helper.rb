# frozen_string_literal: true

module ParserHelper
  # Seed database with geolocation of recycling bins in NYC by making call to NYC Open Data API.
  def self.get_bins
    response = HTTParty.get("https://data.cityofnewyork.us/resource/ggvk-gyea.json?$$app_token=#{Rails.application.credentials.dig(:city_of_nyc_api_key)}")
    response.each do |row|
      Bin.create(row) if row['latitude'] && row['longitude']
    end
  end

  def self.get_landmarks
    landmarks_file = File.read('db/nyc_landmarks/nyc_landmarks.json')
    landmarks_hash = JSON.parse(landmarks_file)["nyc-landmarks"]
    landmarks_hash.each do |landmark|
      Landmark.create(landmark)
    end
  end

end
