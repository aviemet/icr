class Client < ApplicationRecord
  belongs_to :person, dependent: :destroy
  has_and_belongs_to_many :shifts, foreign_key: :person_id
  has_many :household_members
  has_many :households, through: :household_members

  def shifts_in_range(range_start, range_end)
    shifts
      .includes(:clients, :employee, :shift_exceptions)
      .between(range_start, range_end)
      .left_outer_joins(:recurring_pattern)
      .where(recurring_pattern: { end_date: nil })
  end
end
