class ApplicationController < ActionController::Base
  include Pundit::Authorization
  include PublicActivity::StoreController

  include Authentication
  include Authorization
  include InertiaCsrf
  include Localization
  include Searchable
  include StrongParams

  include InertiaShare::Auth
  include InertiaShare::Flash
  include InertiaShare::Menu

  # include ErrorHandling
end
