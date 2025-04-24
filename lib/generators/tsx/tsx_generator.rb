# frozen_string_literal: true

require_relative "../tsx"
require "rails/generators/resource_helpers"

class TsxGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("lib/templates/tsx/view", Rails.root)

  argument :args, type: :array, default: [], banner: "model_name attribute attribute attribute ..."

  class_option :base_only, type: :boolean, default: false, desc: "Only generate the base component"
  class_option :only, type: :array, default: [], desc: "Generate only the components specified"
  class_option :except, type: :array, default: [], desc: "Don't generate the components specified"

  def create_tsx_components
    if file_path.include?("/")
      create_single_view
    else
      create_all_views
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

  def create_single_view
    namespace = file_path.split("/").map(&:camelize).join("/")
    empty_directory File.join("app/frontend/Pages", namespace)
    template "index.tsx.tt", File.join("app/frontend/Pages", namespace, "index.tsx")
  end

  def create_all_views
    base_path = File.join("app/frontend/Pages", file_path.camelize)
    %w[Index Show Edit New].each do |action|
      empty_directory File.join(base_path, action)
      template "index.tsx.tt", File.join(base_path, action, "index.tsx")
    end
  end
end
