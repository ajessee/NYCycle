# frozen_string_literal: true

Rails.application.routes.draw do
  root 'welcome#hello'
  get 'welcome/hello'
  post 'welcome/fetch_closest_bin', to: 'welcome#fetch_closest_bin'
  post 'welcome/fetch_coords_and_bin', to: 'welcome#fetch_coords_and_bin'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
