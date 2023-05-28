class SerializerGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)

  class_option :actions, type: :array, default: []

  def create_serializer
    pry
    # template 'serializer.rb', "app/serializers/#{file_path}_serializer.rb"
  end
end
