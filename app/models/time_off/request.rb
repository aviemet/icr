# frozen_string_literal: true

# == Schema Information
#
# Table name: time_off_requests
#
#  id          :uuid             not null, primary key
#  ends_at     :datetime         not null
#  hours       :decimal(8, 2)    not null
#  kind        :integer          not null
#  review_note :text
#  reviewed_at :datetime
#  starts_at   :datetime         not null
#  status      :integer          default("pending"), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  employee_id :uuid             not null
#  shift_id    :uuid
#
# Indexes
#
#  index_time_off_requests_on_employee_id             (employee_id)
#  index_time_off_requests_on_employee_id_and_status  (employee_id,status)
#  index_time_off_requests_on_shift_id                (shift_id)
#  index_time_off_requests_on_status                  (status)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (shift_id => shifts.id)
#
module TimeOff
  class Request < ApplicationRecord
    self.table_name = "time_off_requests"

    resourcify

    belongs_to :employee, class_name: "Employee"
    belongs_to :shift, optional: true

    enum :kind, {
      pto: 0,
      sick: 1,
    }

    enum :status, {
      pending: 0,
      approved: 1,
      denied: 2,
      canceled: 3,
    }

    validates :starts_at, :ends_at, :hours, :kind, :status, presence: true
    validates :hours, numericality: { greater_than: 0 }
    validate :ends_at_after_starts_at

    scope :pending_for_manager, ->(manager) {
      employee_ids = Employee::EmployeesManager.current
        .where(manager_id: manager.id, primary: true)
        .select(:employee_id)
      pending.where(employee_id: employee_ids)
    }

    scope :includes_associated, -> {
      includes(employee: { person: :contact })
    }

    def service_type_slug
      return "vacation" if pto?

      "sick"
    end

    private

    def ends_at_after_starts_at
      return if starts_at.blank? || ends_at.blank?
      return if ends_at > starts_at

      errors.add(:ends_at, "must be after starts_at")
    end
  end
end
