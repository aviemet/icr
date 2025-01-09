Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  root "pages#index"

  match "/404", to: "errors#not_found", as: :error_404, via: :all
  match "/422", to: "errors#unprocessable_entity", as: :error_422, via: :all
  match "/500", to: "errors#internal_server_error", as: :error_500, via: :all

  # CONCERNS #

  concern :schedulable do
    member do
      get "schedule"
    end
  end

  # DEVISE PATHS #

  devise_for(
    :users,
    controllers: {
      sessions: "users/sessions",
    },
    path: "/",
    path_names: {
      sign_in: "login",
      sign_out: "logout",
    },
    only: [:sessions],
  )

  devise_for(
    :users,
    controllers: {
      passwords: "users/passwords",
      registrations: "users/registrations",
      unlocks: "users/unlocks",
      confirmations: "users/confirmations",
      # omniauth_callbacks: "users/omniauth_callbacks",
    },
    path_names: {
      sign_up: :register,
    },
    skip: [:sessions],
  )

  # RESOURCEFUL PATHS #
  resources :settings, only: [:index]
  put :settings, to: "settings#update"
  patch :settings, to: "settings#update"

  resources :clients, param: :slug, concerns: :schedulable

  resources :employees, param: :slug, concerns: :schedulable

  resources :people, param: :slug

  resources :vendors, param: :slug

  resources :incident_reports

  resources :prescriptions

  resources :dosages

  resources :doctors, param: :slug

  resources :medications

  resources :identifications

  resources :job_titles

  draw(:api)
end
