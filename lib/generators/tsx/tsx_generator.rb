# frozen_string_literal: true

require_relative "../tsx"
require "rails/generators/resource_helpers"

class TsxGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("lib/templates/tsx/scaffold", Rails.root)

  argument :args, type: :array, default: [], banner: "model_name attribute attribute attribute ..."

  class_option :base_only, type: :boolean, default: false, desc: "Only generate the base component"
  class_option :only, type: :array, default: [], desc: "Generate only the components specified"
  class_option :except, type: :array, default: [], desc: "Don't generate the components specified"

  def create_tsx_components
    validate_options
    empty_directory File.join("app/frontend/Pages", model_name.pluralize.camelize).gsub("::", "/")
    generate_components
  end

  private

  def validate_options
    return unless options[:only].present? && options[:except].present?

    raise ArgumentError, "Only one of --only or --except can be used as flags"
  end

  def model_name
    file_path.singularize
  end

  def generate_components
    return if options[:base_only]

    views = ["Index/index", "Edit/index", "Show/index", "New/index", "Form", "Table"]

    if options[:only].present?
      views.select! { |view| options[:only].include?(view.split("/").last) }
    elsif options[:except].present?
      views.reject! { |view| options[:except].include?(view.split("/").last) }
    end

    views.each do |view|
      if view.include?("/")
        directory_path = File.join("app/frontend/Pages", model_name.pluralize.camelize, view.split("/").first).gsub("::", "/")
        empty_directory directory_path
        template "#{view}.tsx.tt", File.join(directory_path, "index.tsx")
      else
        template "#{view}.tsx.tt", File.join("app/frontend/Pages", model_name.pluralize.camelize, "#{view}.tsx").gsub("::", "/")
      end
    end
  end
end
