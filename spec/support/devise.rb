require "devise"
require_relative "request_macros"
require_relative "request_spec_helper"

RSpec.configure do |config|
  config.include Devise::Test::IntegrationHelpers
  config.include Devise::Test::ControllerHelpers, type: :controller
  config.include Warden::Test::Helpers
  config.include Warden::Test::Helpers, type: :policy

  config.before type: :controller do
    @request.env["devise.mapping"] = Devise.mappings[:user] if defined?(Devise)
  end

  config.extend RequestMacros
  config.extend RequestMacros, type: :policy
end
