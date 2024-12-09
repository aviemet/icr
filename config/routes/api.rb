namespace :api do
  resources :users, only: [:create, :update] do
    patch "update_user_preferences" => "users#update_user_preferences", as: :update_user_preferences
    patch "update_table_preferences" => "users#update_table_preferences", as: :update_table_preferences
  end

  resources :spotlights, only: [:index]
end
