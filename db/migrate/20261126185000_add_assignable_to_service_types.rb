# frozen_string_literal: true

class AddAssignableToServiceTypes < ActiveRecord::Migration[8.0]
  NON_ASSIGNABLE_NAMES = [
    "No Service",
    "Holiday",
    "Vacation",
    "Sick",
    "Day Program",
    "Natural Support",
  ].freeze

  ASSIGNABLE_ORDER = [
    "Regular",
    "On-Call",
    "Overnight",
    "Training",
    "Other",
  ].freeze

  NON_ASSIGNABLE_ORDER = [
    "Holiday",
    "Vacation",
    "Sick",
    "Day Program",
    "Natural Support",
    "No Service",
  ].freeze

  def up
    add_column :service_types, :assignable, :boolean, null: false, default: true

    say_with_time "backfill service_types.assignable" do
      ServiceType.reset_column_information
      ServiceType.where(name: NON_ASSIGNABLE_NAMES).update_all(assignable: false) # rubocop:disable Rails/SkipsModelValidations
      ServiceType.where.not(name: NON_ASSIGNABLE_NAMES).update_all(assignable: true) # rubocop:disable Rails/SkipsModelValidations
    end

    say_with_time "reorder service_types positions" do
      (ASSIGNABLE_ORDER + NON_ASSIGNABLE_ORDER).each_with_index do |name, index|
        ServiceType.where(name: name).update_all(position: index) # rubocop:disable Rails/SkipsModelValidations
      end
    end
  end

  def down
    remove_column :service_types, :assignable
  end
end
