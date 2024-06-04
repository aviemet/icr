Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  root "pages#index"

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

  get "settings", to: "pages#index", as: :settings

  resources :shifts, path: :schedule, only: [:index, :create, :update]

  resources :clients, concerns: :schedulable

  resources :employees, concerns: :schedulable

  resources :people

  resources :vendors

  resources :incident_reports

  resources :incident_types

  resources :prescriptions

  resources :dosages

  resources :doctors

  resources :medications

  resources :pay_rates

  resources :employees_job_titles

  resources :calendar_event_exceptions

  resources :calendar_events

  resources :identifications

  resources :job_titles

  draw(:api)
end
