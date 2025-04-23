namespace :api do
  resources :users, only: [:create, :update]
  patch "users/:id/update_table_preferences" => "users#update_table_preferences", as: :update_table_preferences
  patch "users/:id/update_user_preferences" => "users#update_user_preferences", as: :update_user_preferences

  resources :categories, only: [:create, :update, :destroy], param: :slug

  resources :spotlights, only: [:index]

  resources :calendar_events, only: [:create, :update, :destroy]

  scope :options do
    [:employees, :clients, :job_titles].each do |model|
      get model.to_s => "#{model}#options", as: "#{model}_options"
    end
    get "categories/:category_type" => "categories#options", as: "category_options"

    scope :locales do
      get "currencies" => "locales#currencies", as: :currencies
      get "timezones" => "locales#timezones", as: :timezones
      get "languages" => "locales#languages", as: :languages
      get "pay_periods" => "locales#pay_periods", as: :pay_periods
    end
  end

  scope :clients do
    get ":slug/schedule" => "clients#schedule", param: :slug, as: "client_schedule"
  end
end
