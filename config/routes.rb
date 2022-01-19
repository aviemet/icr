Rails.application.routes.draw do
  # devise_for :users

  root "pages#index"
  resources :clients
  resources :employees
  get "schedules", to: "pages#index", as: :schedules
  get "settings", to: "pages#index", as: :settings
end
