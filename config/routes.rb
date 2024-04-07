Rails.application.routes.draw do
  resources :job_titles
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

  # RESOURCEFUL PATHS #

  resources :shifts, path: :schedule, only: [:index, :create, :update]
  resources :clients, concerns: :schedulable
  resources :employees, concerns: :schedulable
  resources :people

  get "settings", to: "pages#index", as: :settings

  draw(:api)
end
