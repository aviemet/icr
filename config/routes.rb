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
    resources :requirements
    resources :requirement_types
    get "payroll", to: redirect("/settings/payroll/schedule")
    scope path: "payroll", as: "payroll" do
      get "schedule", to: "payrolls#schedule"
      match "schedule", to: "payrolls#update_schedule", via: [:patch, :put]
      get "overtime", to: "payrolls#overtime"
      match "overtime", to: "payrolls#update_overtime", via: [:patch, :put]
      get "ihss", to: "payrolls#ihss"
      match "ihss", to: "payrolls#update_ihss", via: [:patch, :put]
    end
    get "notifications", to: "notifications#show"
    match "notifications", to: "notifications#update", via: [:patch, :put]
    get "user", to: "users#show", as: :user
    resources :overtime_exemptions, only: [:create, :update]
  end
  resource :settings, param: :slug, except: [:new, :create, :destroy]

  # RESOURCEFUL PATHS #

  resources :clients, param: :slug, concerns: :schedulable do
    resources :support_contacts, controller: "clients/support_contacts", only: [:create, :update, :destroy]
    resources :allergies, controller: "clients/allergies", only: [:create, :update, :destroy]
    resources :diagnoses, controller: "clients/diagnoses", only: [:create, :update, :destroy]
    resources :prescriptions, controller: "clients/prescriptions", only: [:create, :update, :destroy]
    resources :hospital_visits, controller: "clients/hospital_visits", only: [:create, :update, :destroy]
    resources :enrollments, controller: "clients/enrollments", only: [:create, :update, :destroy]
    resources :managers, controller: "clients/managers", only: [:create, :update, :destroy]
    resources :attendants, controller: "clients/attendants", only: [:create, :update, :destroy]
    resources :doctors, controller: "clients/doctors", only: [:create, :destroy]
    resources :documents, controller: "clients/documents", only: [:create, :destroy]
    resources :images, controller: "clients/images", only: [:create, :destroy]
    resources :trainings, controller: "clients/trainings", only: [:create, :update, :destroy]
    resource :life_detail, controller: "clients/life_details", only: [:update]
  end

  scope "/employees" do
    resources :trainings, path: "trainings" do
      member do
        put :status, action: :update_status
      end
    end
    resources :interviews, path: "interviews" do
      resources :interview_notes, only: [:create, :update, :destroy]
    end
    resources :applicants, only: [:index]
  end

  resources :employees, param: :slug, concerns: :schedulable do
    member do
      get :status
      put :status, action: :update_status
      delete :pending_termination, action: :destroy_pending_termination
    end
    resources :support_contacts, controller: "employees/support_contacts", only: [:create, :update, :destroy]
    resources :credentials, controller: "employees/credentials", only: [:create, :update, :destroy]
    resources :clearances, controller: "employees/clearances", only: [:create, :update, :destroy]
    resources :identifications, controller: "employees/identifications", only: [:create, :update, :destroy]
    resources :pay_rates, controller: "employees/pay_rates", only: [:create, :update, :destroy]
    resources :managers, controller: "employees/managers", only: [:create, :update, :destroy]
    resources :client_attendants, controller: "employees/client_attendants", only: [:create, :update, :destroy]
    resources :client_managers, controller: "employees/client_managers", only: [:create, :update, :destroy]
    resources :trainings, controller: "employees/trainings", only: [:create, :update, :destroy]
    resources :documents, controller: "employees/documents", only: [:create, :destroy]
    resources :images, controller: "employees/images", only: [:create, :destroy]
    resources :offers, controller: "employees/offers", only: [:create, :update, :destroy]
  end

  resources :households, param: :slug, concerns: :schedulable

  resources :shift_templates

  resources :caseloads, only: [:index, :create, :update]

  scope path: "payroll" do
    get "/", to: "pay_periods#index", as: :payroll_periods

    resources :periods, controller: "pay_periods", only: [:show] do
      member do
        post :finalize
        get :export
        get :clients
        get "clients/:client_id", action: :client, as: :client
        get :ihss, action: :ihss
        match :ihss, action: :update_ihss, via: [:patch, :put]
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

    resources :shifts, only: [], controller: "payroll/shifts" do
      member do
        post :approve
        post :unapprove
        patch :ihss, action: :update_ihss
        patch :category, action: :update_category
      end
      collection do
        post :bulk_approve
      end
    end
  end

  resources :vendors, param: :slug

  resources :incident_reports

  resources :doctors, param: :slug

  get "requirements", to: redirect("/settings/requirements")
  get "requirements/*path", to: redirect { |params, _req| "/settings/requirements/#{params[:path]}" }
  get "requirement_types", to: redirect("/settings/requirement_types")
  get "requirement_types/*path", to: redirect { |params, _req| "/settings/requirement_types/#{params[:path]}" }

  draw(:api)

  if Rails.env.local?
    namespace :dev do
      resource :acts_as, only: [:create, :destroy], controller: "acts_as"
    end
  end
end
