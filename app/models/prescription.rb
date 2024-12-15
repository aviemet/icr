# == Schema Information
#
# Table name: prescriptions
#
#  id            :uuid             not null, primary key
#  ends_at       :date
#  starts_at     :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  client_id     :uuid             not null
#  doctor_id     :uuid             not null
#  dosage_id     :uuid             not null
#  medication_id :uuid             not null
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
class Prescription < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:medication, :client, :start_at, :ends_at, :doctor, :dosage],
    associated_against: {
      medication: [],
      client: [],
      doctor: [],
      dosage: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :medication
  belongs_to :client
  belongs_to :doctor
  belongs_to :dosage

  scope :active, -> { where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current) }
  scope :historical, -> { where.not(ends_at: nil).where(ends_at: ...Time.current) }

  scope :includes_associated, -> { includes([:medication, :client, :doctor, :dosage]) }
end
