# == Schema Information
#
# Table name: clients
#
#  id          :bigint           not null, primary key
#  active_at   :date
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

  identifier :slug

  attributes(
    :first_name,
    :middle_name,
    :last_name,
    :person_type,
    :user_id,
    :job_title_id,
    full_name: { type: :string },
  )
end
