# == Schema Information
#
# Table name: doctors_clients
#
#  id         :bigint           not null, primary key
#  notes      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :bigint           not null
#  doctor_id  :bigint           not null
#
# Indexes
#
#  index_doctors_clients_on_client_id  (client_id)
#  index_doctors_clients_on_doctor_id  (doctor_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (doctor_id => doctors.id)
#
class DoctorsClient < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:doctor, :client, :notes],
    associated_against: {
      doctor: [],
      client: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :doctor
  belongs_to :client

  scope :includes_associated, -> { includes([:doctor, :client]) }
end
