# frozen_string_literal: true

module InertiaShare::Permissions
  extend ActiveSupport::Concern

  included do
    inertia_share do
      {
        permissions: cached_permissions
      }
    end
  end

  private

  def cached_permissions
    Rails.cache.fetch("user_permissions/#{current_user&.id}", expires_in: 5.minutes) do
      build_permissions_hash
    end
  end

  def build_permissions_hash
    policy_classes.each_with_object({}) do |policy_class, permissions|

      resource = resource_name_for(policy_class)
      model_class = policy_class.to_s.remove("Policy").constantize
      record = model_class.new # Create a new instance for class-level checks
      permissions[resource] = build_permission_values_for(policy(record))
    rescue NameError => e
      Rails.logger.debug { "Skipping permissions for #{policy_class}: #{e.message}" }
      next

    end
  end

  def policy_classes
    Rails.root.glob("app/policies/**/*_policy.rb").map do |file|
      path = file.relative_path_from(Rails.root.join("app/policies"))
      path.to_s.delete_suffix(".rb").camelize.constantize
    end.reject { |klass| klass == ApplicationPolicy }
  end

  def build_permission_values_for(policy)
    # Only get methods that end with ? and are defined in the policy class itself
    policy_methods = policy.class.instance_methods(false).select { |m| m.to_s.end_with?("?") }

    policy_methods.each_with_object({}) do |method, permissions|
      action = method.to_s.chomp("?").to_sym
      permissions[action] = evaluate_permission(policy, method)
    end
  end

  def evaluate_permission(policy, method)
    # Try calling without args first

    policy.public_send(method)
  rescue ArgumentError => e
    if e.message.include?("wrong number of arguments")
      begin
        # Only retry with record if it was an argument count error
        policy.public_send(method, policy.record)
      rescue ArgumentError, NoMethodError, TypeError
        # If that fails too, return false
        false
      end
    else
      # Other ArgumentErrors should fail gracefully
      false
    end
  rescue Pundit::NotAuthorizedError, NoMethodError, TypeError
    false
  end

  def resource_name_for(policy_class)
    policy_class.to_s.remove("Policy").underscore.pluralize
  end
end