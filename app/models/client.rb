class Client < Person
  has_and_belongs_to_many :shifts, foreign_key: :person_id
  has_and_belongs_to_many :households, foreign_key: :person_id

  before_validation ->(model) { model.person_type = :client }

  default_scope { where(person_type: :client) }
end
