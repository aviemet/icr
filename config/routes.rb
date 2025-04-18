Rails.application.routes.draw do
  namespace :requirement do
    resources :requirements
  end
  resources :trainings
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  root "pages#dashboard"

  get "/home" => "pages#home"

  scope :error do
    match "/:status", to: "errors#show", as: :error, via: :all
  end

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

  # SETTINGS PATHS #

  get "settings/general", to: "settings#show"
  namespace :settings do
    get "", to: redirect("/settings/general")
    resource :calendars, path: :calendar, only: [:show, :update], as: :calendar
    resources :people, param: :slug
    resources :job_titles, param: :slug
    resource :payrolls, path: :payroll, only: [:show, :update], as: :payroll
  end
  resource :settings, param: :slug, except: [:new, :create, :destroy]

  # RESOURCEFUL PATHS #

  resources :clients, param: :slug, concerns: :schedulable

  resources :employees, param: :slug, concerns: :schedulable

  resources :households, param: :slug

  resources :shift_templates

  resources :timesheets

  resources :vendors, param: :slug

  resources :incident_reports

  resources :doctors, param: :slug

  draw(:api)
end
