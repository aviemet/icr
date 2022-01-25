Rails.application.routes.draw do
  devise_for :users, controllers: {
    confirmations: "users/confirmations",
    omniauths: "users/omniauth",
    passwords: "users/passwords",
    registrations: "users/registrations",
    sessions: "users/sessions",
    unlocks: "users/unlocks",
  }

  root "pages#index"
  resources :clients
  resources :employees
  get "schedules", to: "pages#index", as: :schedules
  get "settings", to: "pages#index", as: :settings
end
