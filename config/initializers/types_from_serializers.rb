if Rails.env.development?
  TypesFromSerializers.config do |config|
    config.base_serializers = ["ApplicationSerializer"]
    config.namespace = "Schema"
  end
end
