# == Schema Information
#
# Table name: shifts
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  employee_id :bigint           not null
#
# Indexes
#
#  index_shifts_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
class Shift < ApplicationRecord
  include Schedulable

  pg_search_scope(
    :search,
    against: [:calendar_event, :client, :employee, :household],
    associated_against: {
      calendar_event: [],
      employee: [:number],
      clients: [:numbers],
      households: [:name],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :created_by, class_name: "User", optional: true

  belongs_to :employee

  has_many :shifts_shiftables, dependent: :nullify
  has_many :clients, through: :shifts_shiftables, source: :shiftable, source_type: 'Client'
  has_many :households, through: :shifts_shiftables, source: :shiftable, source_type: 'Household'

  validate :at_least_one_shiftable

  scope :includes_associated, -> { includes([:calendar_event, :employee,  :clients, :households]) }

  # TODO: This needs to be customizable
  def title
    "#{calendar_event&.starts_at&.hour} - #{employee.first_name}"
  end

  private

  def at_least_one_shiftable
    unless clients.present? || households.present?
      errors.add(:shiftable, "Shift must have at least one associated Client or Household")
    end
  end
end
