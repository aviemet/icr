# == Schema Information
#
# Table name: client_diagnoses
#
#  id           :uuid             not null, primary key
#  active       :boolean          default(TRUE), not null
#  code         :string
#  diagnosed_on :date
#  name         :string           not null
#  notes        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  client_id    :uuid             not null
#  doctor_id    :uuid
#
# Indexes
#
#  index_client_diagnoses_on_client_id  (client_id)
#  index_client_diagnoses_on_doctor_id  (doctor_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (doctor_id => doctors.id)
#
class Client::DiagnosisSerializer < ApplicationSerializer
  object_as :diagnosis, model: "Client::Diagnosis"

  attributes(
    :client_id,
    :doctor_id,
    :name,
    :code,
    :diagnosed_on,
    :notes,
    :active,
  )
end
