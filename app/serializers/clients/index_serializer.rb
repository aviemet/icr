class Clients::IndexSerializer < ApplicationSerializer
  object_as :client

  attributes(
    :id,
    :number,
    :created_at,
    :updated_at,
  )

  belongs_to :person, serializer: PersonSerializer
end
