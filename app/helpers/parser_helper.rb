module ParserHelper

  #Seed database with geolocation of recycling bins in NYC by making call to NYC Open Data API.
  def self.get_data
    response = HTTParty.get("https://data.cityofnewyork.us/resource/ggvk-gyea.json?$$app_token=#{Rails.application.credentials.dig(:city_of_nyc_api_key)}")
    response.each {|row| Bin.create(row) if row["latitude"] && row["longitude"]}
  end

end
