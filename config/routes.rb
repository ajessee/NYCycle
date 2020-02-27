Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root 'bins#index'

  resources :bins, only: [:index, :show]
    post 'bins/getlatlng', :to => 'bins#getlatlng'
    post 'bins/walking_directions', :to => 'bins#walking_directions'
    post 'bins/street_view', :to => 'bins#street_view'
    post 'bins/convert_to_latlng', :to => 'bins#convert_to_latlng'
end
