# frozen_string_literal: true

require "rails/generators"
require "rails/generators/named_base"

class SerializerGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)

  argument :args, type: :array, default: [], banner: "model_name attribute attribute attribute ..."

  class_option :base_only, type: :boolean, default: false, desc: "Only generate the base serializer"
  class_option :only, type: :array, default: [], desc: "Generate only the actions specified"
  class_option :except, type: :array, default: [], desc: "Don't generate the actions specified"
  class_option :skip_ts, type: :boolean, default: true, desc: "Skip generating ts files. Generation will fail unless migrations have been run. Setting to false will run migrations before generating types"

  def create_serializer
    validate_options

    template "serializer.rb", "app/serializers/#{model_name}_serializer.rb"

    generate_named_serializers

    unless options[:skip_ts]
      system("rails db:migrate")
      system("rails types:generate")
    end
  end

  private

  def validate_options
    return unless options[:only].present? && options[:except].present?

    raise ArgumentError, "Only one of --only or --except can be used as flags"
  end

  def model_name
    file_path.singularize
  end

  def ar_model
    model_exists? ? model_name.camelize.constantize : nil
  rescue NameError
    nil
  end

  def model_attributes
    args_attributes = args[1..] || []

    return args_attributes unless args_attributes&.empty?

    if ar_model&.ancestors&.include?(ActiveRecord::Base)
      return ar_model.attribute_names.reject { |attr| attr.to_s == "id" }
    end

    []
  end

  def generate_named_serializers
    return if options[:base_only]

    views = %i(edit form_data index show)

    if options[:only].present?
      views.select! { |view| options[:only].include?(view.to_s) }
    elsif options[:except].present?
      views.reject! { |view| options[:except].include?(view.to_s) }
    end

    views.push :persisted

    views.each { |view| generate_named_serializer(view) }
  end

  def generate_named_serializer(name)
    template "#{name}_serializer.rb.tt", "app/serializers/#{model_name.pluralize}/#{name}_serializer.rb"
  end

  def model_exists?
    Rails.root.join("app", "models", "#{model_name}.rb").exist?
  end
end
