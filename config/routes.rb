Rails.application.routes.draw do
  # devise_for :users
  
  root "pages#index"
  resources :pages
	get "schedules", to: "pages#index", as: :schedules
	get "clients", to: "pages#index", as: :clients
	get "staff", to: "pages#index", as: :staff
	get "settings", to: "pages#index", as: :settings
end
