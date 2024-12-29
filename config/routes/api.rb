namespace :api do
  resources :users, only: [:create, :update] do
    patch "update_user_preferences" => "users#update_user_preferences", as: :update_user_preferences
    patch "update_table_preferences" => "users#update_table_preferences", as: :update_table_preferences
  end

  resources :spotlights, only: [:index]

  resources :calendar_events, only: [:create, :update, :destroy]

  scope :options do
    [:employees].each do |model|
      get model.to_s => "#{model}#options", as: "#{model}_options"
    end
    get "categories/:category_type" => "categories#options", as: "category_options"
  end
end
