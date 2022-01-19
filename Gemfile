source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.0.3"

# Server
gem "rails", "~> 7.0.1"
gem "sprockets-rails"
gem "pg", "~> 1.1"
gem "puma", "~> 5.0"

# Assets
gem "jbuilder"
gem "webpacker", git: 'https://github.com/rails/webpacker.git'
gem "inertia_rails", "~> 1.11"
gem "js-routes", "~> 2.2"

# Helpers
gem "factory_bot", "~> 6.2"
gem "devise", "~> 4.8"
gem "ice_cube", "~> 0.16.4"
gem "slug", "~> 4.1"

# Use Redis adapter to run Action Cable in production
# gem "redis", "~> 4.0"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

group :development, :test do
  gem "rspec-rails", "~> 5.0"

  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
  gem "better_errors", "~> 2.9"
  gem "awesome_print", "~> 1.9"
  gem "solargraph", "~> 0.44.2"
  gem "rubocop-rails", "~> 2.13"
  gem "rubocop-rspec", "~> 2.7"
  gem "rubocop-performance", "~> 1.13"
  gem "rubocop-daemon", "~> 0.3.2"
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"

  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  gem "spring"

  # Live Reload
  gem "rack-livereload", "~> 0.3.17"
  gem "guard-livereload", "~> 2.5", require: false
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara"
  gem "selenium-webdriver"
  gem "webdrivers"
end
