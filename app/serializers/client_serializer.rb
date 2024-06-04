# == Schema Information
#
# Table name: clients
#
#  id          :bigint           not null, primary key
#  active_at   :date
#  color       :string
#  inactive_at :date
#  number      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :bigint           not null
#
# Indexes
#
#  index_clients_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class ClientSerializer < ApplicationSerializer
  object_as :client

  attributes(
    :person_id,
    :number,
    :active_at,
    :inactive_at,
  )

  belongs_to :person, serializer: PersonSerializer
end
