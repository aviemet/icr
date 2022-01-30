class Employee < Person
	has_many :shifts, dependent: :nullify

  before_validation :set_person_type

  default_scope { where(person_type: :employee) }

  private

  def set_person_type
    self.person_type = :employee
  end
end
