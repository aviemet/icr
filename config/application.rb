require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Icr
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1
    config.exceptions_app = self.routes

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.

    config.time_zone = "Pacific Time (US & Canada)"

    config.autoload_paths += %W[#{config.root}/lib #{config.root}/app/schemas]
    config.eager_load_paths += %W[#{config.root}/app/schemas]

    config.generators do |g|
      g.orm :active_record, primary_key_type: :uuid

      g.test_framework      :rspec
      g.view_specs          false
      g.routing_specs       false

      g.template_engine     :tsx
      g.scaffold_stylesheet false
      g.stylesheets         false
      g.javascripts         false
      g.assets              false
      g.helper              false
    end

    config.active_storage.service = :local

    config.active_record.yaml_column_permitted_classes = [Symbol, Hash, Array, Time, Date, ActiveRecord::Base, ActiveSupport::HashWithIndifferentAccess]

    config.active_job.queue_adapter = :good_job

    # Establish db connection upon entering rails console
    console do
      ActiveRecord::Base.connection
    end
  end
end
