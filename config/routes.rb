Rails.application.routes.draw do
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

  get "users/:slug/settings", to: "users#settings", as: :user_settings

  get "settings/general", to: "settings#show"
  namespace :settings do
    get "", to: redirect("/settings/general")
    resource :calendars, path: :calendar, only: [:show, :update], as: :calendar
    get "calendar/shift_types", to: "calendars#shift_types", as: :calendar_shift_types
    resources :people, param: :slug
    resource :company, only: [:show, :update]
    resources :job_titles, param: :slug
    resources :departments, param: :slug do
      delete "", action: :destroy, on: :collection
    end
    get "payroll", to: redirect("/settings/payroll/schedule")
    scope path: "payroll", as: "payroll" do
      get "schedule", to: "payrolls#schedule"
      match "schedule", to: "payrolls#update_schedule", via: [:patch, :put]
      get "overtime", to: "payrolls#overtime"
      match "overtime", to: "payrolls#update_overtime", via: [:patch, :put]
    end
    resources :overtime_exemptions, only: [:create, :update]
  end
  resource :settings, param: :slug, except: [:new, :create, :destroy]

  # RESOURCEFUL PATHS #

  resources :clients, param: :slug, concerns: :schedulable

  scope "/employees" do
    resources :trainings, path: "trainings"
    resources :interviews, path: "interviews"
  end

  resources :employees, param: :slug, concerns: :schedulable do
    member do
      get :status
      put :status, action: :update_status
    end
  end

  resources :households, param: :slug, concerns: :schedulable

  resources :shift_templates

  scope path: "payroll" do
    get "/", to: "pay_periods#index", as: :payroll_periods

    resources :periods, controller: "pay_periods", only: [:show] do
      member do
        post :finalize
        get :export
      end
      post :adjustments, on: :member, action: :create_adjustment, as: :adjustments
      get "employees/:employee_id", to: "timesheets#employee_review", as: :employee_review
    end

    resources :timesheets, only: [:show, :new, :edit, :create, :update, :destroy] do
      member do
        post :approve
        post :unapprove
      end

      collection do
        post :bulk_approve
      end
    end
  end

  resources :vendors, param: :slug

  resources :incident_reports

  resources :doctors, param: :slug

  resources :requirements

  draw(:api)
end
