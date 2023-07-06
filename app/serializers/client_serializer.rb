class ClientSerializer < ApplicationSerializer
  object_as :client

  attributes(
    :number,
    :settings,
    :created_at,
    :updated_at,
  )

  belongs_to :person, serializer: PersonSerializer
end
