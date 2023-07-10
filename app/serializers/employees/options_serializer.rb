class Employees::OptionsSerializer < ApplicationSerializer
  object_as :employee

  attributes(
    :id,
  )

  type :string
  def name
    employee.person.name
  end

  has_many :clients, serializer: Clients::ShallowSerializer
end
