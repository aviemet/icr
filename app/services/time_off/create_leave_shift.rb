# frozen_string_literal: true

module TimeOff
  class CreateLeaveShift
    def self.call(employee:, service_type_slug:, starts_at:, ends_at:, name: nil)
      new(
        employee: employee,
        service_type_slug: service_type_slug,
        starts_at: starts_at,
        ends_at: ends_at,
        name: name,
      ).call
    end

    def initialize(employee:, service_type_slug:, starts_at:, ends_at:, name:)
      @employee = employee
      @service_type_slug = service_type_slug
      @starts_at = starts_at
      @ends_at = ends_at
      @name = name
    end

    def call
      service_type = ServiceType.find_by!(slug: @service_type_slug)
      category_id = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |record|
        record.system = true
      }.id

      event = Calendar::Event.new(
        name: @name.presence || service_type.name,
        starts_at: @starts_at,
        ends_at: @ends_at,
        category_id: category_id,
        shift_attributes: {
          employee_id: @employee.id,
          service_type_id: service_type.id,
        },
      )
      event.save!
      event.shift
    end
  end
end
