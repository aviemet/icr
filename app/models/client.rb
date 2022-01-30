class Client < Person
	has_and_belongs_to_many :shifts, foreign_key: :person_id

	before_validation :set_person_type

  default_scope { where(person_type: :client) }

  private

  def set_person_type
    self.person_type = :client
  end
end
