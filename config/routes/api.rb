namespace :api do
  resources :users, only: [:create, :update]
  patch "users/:id/update_user_preferences" => "users#update_user_preferences", as: :update_user_preferences
  patch "users/:id/update_table_preferences" => "users#update_table_preferences", as: :update_table_preferences

  resources :spotlights, only: [:index]
end
