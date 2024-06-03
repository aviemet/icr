# == Schema Information
#
# Table name: prescriptions
#
#  id            :bigint           not null, primary key
#  ends_at       :date
#  start_at      :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  client_id     :bigint           not null
#  doctor_id     :bigint           not null
#  dosage_id     :bigint           not null
#  medication_id :bigint           not null
#
# Indexes
#
#  index_prescriptions_on_client_id      (client_id)
#  index_prescriptions_on_doctor_id      (doctor_id)
#  index_prescriptions_on_dosage_id      (dosage_id)
#  index_prescriptions_on_medication_id  (medication_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (doctor_id => doctors.id)
#  fk_rails_...  (dosage_id => dosages.id)
#  fk_rails_...  (medication_id => medications.id)
#
class PrescriptionSerializer < ApplicationSerializer
  object_as :prescription

  attributes(
    :medication_id,
    :client_id,
    :start_at,
    :ends_at,
    :doctor_id,
    :dosage_id,
  )
end