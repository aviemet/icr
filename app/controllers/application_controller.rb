class ApplicationController < ActionController::Base
  include Pundit::Authorization

  before_action :set_paper_trail_whodunnit

  include Authentication
  include DevActsAs
  include Authorization
  include InertiaCsrf
  include Localization
  include Searchable
  include StrongParams

  include InertiaShare::Auth
  include InertiaShare::Flash
  include InertiaShare::Menu
  include InertiaShare::Settings
  include InertiaShare::Permissions
  include InertiaShare::Features

  include FeatureFlagged
  include ErrorHandling
end
