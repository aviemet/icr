Rails.application.routes.draw do
  root "pages#index"

  # CONCERNS #

  concern :schedulable do
    member do
      get "schedule"
    end
  end

  # DEVISE PATHS #

  devise_for :users, controllers: {
    sessions: "users/sessions"
  },
  path: "/",
  path_names: {
    sign_in: "login",
    sign_out: "logout"
  },
  only: [:sessions]

  devise_for :users, controllers: {
    passwords: "users/passwords",
    registrations: "users/registrations",
    unlocks: "users/unlocks",
    confirmations: "users/confirmations",
    # omniauth_callbacks: "users/omniauth_callbacks",
  },
  path_names: {
    sign_up: :register,
  },
  skip: [:sessions]

  # RESOURCEFUL PATHS #

  resources :shifts, path: :schedule, only: [:index, :create, :update]
  resources :clients, concerns: :schedulable
  resources :employees, concerns: :schedulable
  resources :people

  # TEMPORARY #

  get "settings", to: "pages#index", as: :settings

  namespace :api do
    resources :employees, only: [:update]
  end
end
