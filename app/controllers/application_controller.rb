class ApplicationController < ActionController::Base
  include Pundit::Authorization
  include PublicActivity::StoreController

  include Authentication
  include Authorization
  include InertiaCsrf
  include Localization
  include Searchable
  include StrongParams

  include Inertia::Flash
  include Inertia::Auth
  include Inertia::Menu
end
