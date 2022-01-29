Rails.application.routes.draw do
  root "pages#index"

  devise_for :users, controllers: {
    confirmations: "users/confirmations",
    omniauths: "users/omniauth",
    passwords: "users/passwords",
    registrations: "users/registrations",
    sessions: "users/sessions",
    unlocks: "users/unlocks",
  }

	concern :schedulable do
		member do
			get "schedule"
		end
	end

	resources :schedules, only: [:index]
	resources :clients, concerns: :schedulable
  resources :employees, concerns: :schedulable
	resources :people

  get "settings", to: "pages#index", as: :settings
end
