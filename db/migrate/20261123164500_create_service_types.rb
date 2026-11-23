class CreateServiceTypes < ActiveRecord::Migration[8.1]
  DEFAULT_COLORS = %w[
    #2F6FED
    #0B7A75
    #6B7280
    #7C3AED
    #B45309
    #BE123C
    #0369A1
    #15803D
  ].freeze

  FLAG_DEFAULTS = {
    "Regular" => { billable: true, payable: true, allows_multi_client: false, requires_notes: false, tracks_mileage: false },
    "On-Call" => { billable: true, payable: true, allows_multi_client: false, requires_notes: false, tracks_mileage: false },
    "No Service" => { billable: false, payable: false, allows_multi_client: false, requires_notes: false, tracks_mileage: false, active: false },
    "Holiday" => { billable: false, payable: true, allows_multi_client: false, requires_notes: false, tracks_mileage: false },
    "Vacation" => { billable: false, payable: true, allows_multi_client: false, requires_notes: false, tracks_mileage: false },
    "Sick" => { billable: false, payable: true, allows_multi_client: false, requires_notes: false, tracks_mileage: false },
    "Other" => { billable: true, payable: true, allows_multi_client: false, requires_notes: false, tracks_mileage: false },
    "Overnight" => { billable: true, payable: true, allows_multi_client: false, requires_notes: false, tracks_mileage: false },
  }.freeze

  def up
    create_table :service_types, id: :uuid do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.boolean :active, null: false, default: true
      t.boolean :system, null: false, default: false
      t.integer :position, null: false, default: 0
      t.boolean :billable, null: false, default: true
      t.boolean :payable, null: false, default: true
      t.boolean :allows_multi_client, null: false, default: false
      t.boolean :requires_notes, null: false, default: false
      t.boolean :tracks_mileage, null: false, default: false
      t.string :color, null: false, default: "#2F6FED"

      t.timestamps
    end

    add_index :service_types, :slug, unique: true
    add_index :service_types, :name, unique: true
    add_index :service_types, :active
    add_index :service_types, :position

    add_reference :shifts, :service_type, type: :uuid, foreign_key: true

    slug_map = backfill_service_types_from_shift_categories!
    backfill_shift_service_types!
    remap_overtime_exemption_category_values!(slug_map)

    change_column_null :shifts, :service_type_id, false
    change_column_null :shifts, :category_id, true
  end

  def down
    remove_reference :shifts, :service_type, foreign_key: true
    change_column_null :shifts, :category_id, false
    drop_table :service_types
  end

  private

  def backfill_service_types_from_shift_categories!
    slug_map = {}
    categories = execute_shift_categories

    if categories.empty?
      service_type = insert_service_type!(
        name: "Standard",
        system: true,
        position: 0,
        flags: FLAG_DEFAULTS["Regular"],
      )
      slug_map["standard"] = service_type.slug
      return slug_map
    end

    categories.each_with_index do |category, index|
      flags = FLAG_DEFAULTS.fetch(category.name, {
        billable: true,
        payable: true,
        allows_multi_client: false,
        requires_notes: false,
        tracks_mileage: false,
      })
      service_type = insert_service_type!(
        name: category.name,
        system: category.system,
        position: index,
        flags: flags,
        color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      )
      slug_map[category.slug] = service_type.slug
      slug_map[category.name.parameterize] = service_type.slug
    end

    slug_map
  end

  def execute_shift_categories
    Category.where(categorizable_type: "Shift").order(:name).to_a
  end

  def insert_service_type!(name:, system:, position:, flags:, color: DEFAULT_COLORS.first)
    attrs = {
      name: name,
      slug: name.parameterize,
      system: system,
      position: position,
      color: color,
      active: flags.fetch(:active, true),
      billable: flags.fetch(:billable, true),
      payable: flags.fetch(:payable, true),
      allows_multi_client: flags.fetch(:allows_multi_client, false),
      requires_notes: flags.fetch(:requires_notes, false),
      tracks_mileage: flags.fetch(:tracks_mileage, false),
      created_at: Time.current,
      updated_at: Time.current,
    }

    existing = ServiceType.find_by(name: name) || ServiceType.find_by(slug: attrs[:slug])
    return existing if existing.present?

    ServiceType.create!(attrs)
  end

  def backfill_shift_service_types!
    default_service_type = ServiceType.order(:position, :name).first
    raise "No service types available for shift backfill" if default_service_type.blank?

    Category.where(categorizable_type: "Shift").find_each do |category|
      service_type = ServiceType.find_by(name: category.name)
      next if service_type.blank?

      Shift.where(category_id: category.id, service_type_id: nil).update_all(service_type_id: service_type.id)
    end

    Shift.where(service_type_id: nil).update_all(service_type_id: default_service_type.id)
  end

  def remap_overtime_exemption_category_values!(slug_map)
    return if slug_map.blank?

    OvertimeExemption.find_each do |exemption|
      criteria = exemption.criteria
      next if criteria.blank?

      remapped = criteria.map do |group|
        group.transform_values do |conditions|
          next conditions unless conditions.is_a?(Hash)

          field_conditions = conditions.deep_dup
          value = field_conditions["value"]
          if value.is_a?(String) && slug_map[value]
            field_conditions["value"] = slug_map[value]
          elsif value.is_a?(Array)
            field_conditions["value"] = value.map { |entry| slug_map[entry] || entry }
          end
          field_conditions
        end
      end

      next if remapped == criteria

      exemption.update_columns(criteria: remapped, updated_at: Time.current)
    end
  end
end
