class Client < ApplicationRecord
  belongs_to :person, dependent: :destroy
  has_and_belongs_to_many :shifts
  has_many :household_members
  has_many :households, through: :household_members
  has_many :caregiver_assignments
  has_many :employees, through: :caregiver_assignments

  scope :includes_associated, -> { includes(:person, employees: :person) }

  def shifts_in_range(range_start, range_end)
    shifts
      .includes(:clients, :shift_exceptions, employee: :person)
      .between(range_start, range_end)
      .left_outer_joins(:recurring_pattern)
      .where(recurring_pattern: { end_date: nil })
  end
end
