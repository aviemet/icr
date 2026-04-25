# frozen_string_literal: true

require "rails_helper"

VIEW_NAMES = %w[Show Index Edit FormData Persisted Options Spotlight Public InertiaShare].freeze

RSpec.describe "Serializers smoke" do # rubocop:disable RSpec/DescribeClass
  Rails.application.eager_load!
  serializer_classes = (ApplicationSerializer.descendants + BaseSerializer.descendants).uniq - [ApplicationSerializer, BaseSerializer]

  def self.model_class_for(serializer_class)
    name = serializer_class.name
    parts = name.split("::")
    return nil if parts.empty?

    last = parts.last
    return nil unless last.end_with?("Serializer")

    base_name = last.sub(/Serializer$/, "")
    if parts.size == 1
      base_name.constantize
    elsif VIEW_NAMES.include?(base_name)
      namespace = parts[0..-2].map(&:to_s)
      namespace[-1] = namespace[-1].singularize
      namespace.join("::").constantize
    else
      (parts[0..-2] + [base_name]).join("::").constantize
    end
  rescue NameError
    nil
  end

  def object_for(serializer_class, model_class)
    return nil unless model_class.respond_to?(:limit)

    is_index = serializer_class.name.end_with?("IndexSerializer")
    if is_index
      model_class.limit(0)
    else
      record = model_class.first
      record ||= try_factory_create(model_class)
      record || model_class.new
    end
  end

  def try_factory_create(model_class)
    factory_name = model_class.name.underscore.to_sym
    return nil unless FactoryBot.factories.registered?(factory_name)

    create(factory_name)
  rescue StandardError
    nil
  end

  serializer_classes.each do |serializer_class|
    model_class = model_class_for(serializer_class) # rubocop:disable RSpec/LeakyLocalVariable
    next if model_class.nil?

    it "#{serializer_class.name} runs without error" do
      object = object_for(serializer_class, model_class)
      next if object.nil?

      expect { serializer_class.render(object) }.not_to raise_error
    end
  end
end
