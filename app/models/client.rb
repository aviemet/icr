class Client < Person
  has_and_belongs_to_many :shifts, foreign_key: :person_id
  has_and_belongs_to_many :households, foreign_key: :person_id

  before_validation :set_person_type

  default_scope { where(person_type: :client) }

  def shifts_in_range(range_start, range_end)
    shifts
      .includes(:clients, :employee, :shift_exceptions)
      .between(range_start, range_end)
      .left_outer_joins(:recurring_pattern)
      .where(recurring_pattern: { end_date: nil })
  end

  private

  def set_person_type
    self.person_type = :client
  end
end
