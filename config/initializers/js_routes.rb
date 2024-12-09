JsRoutes.setup do |config|
  # Setup your JS module system:
  # ESM, CJS, AMD, UMD or nil
  # config.module_type = "ESM"
  config.exclude = [/^rails/, /^new_rails/]
  config.compact = true
  config.camel_case = true
  config.file = "../frontend/lib/routes/routes.js"
end
