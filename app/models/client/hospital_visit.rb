# == Schema Information
#
# Table name: client_hospital_visits
#
#  id                 :uuid             not null, primary key
#  admitted_at        :datetime
#  discharged_at      :datetime
#  hospital_name      :string           not null
#  notes              :text
#  reason             :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  client_id          :uuid             not null
#  doctor_id          :uuid
#  incident_report_id :uuid
#
# Indexes
#
#  index_client_hospital_visits_on_client_id           (client_id)
#  index_client_hospital_visits_on_doctor_id           (doctor_id)
#  index_client_hospital_visits_on_incident_report_id  (incident_report_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (doctor_id => doctors.id)
#  fk_rails_...  (incident_report_id => incident_reports.id)
#
class Client::HospitalVisit < ApplicationRecord
  self.table_name = "client_hospital_visits"

  belongs_to :client
  belongs_to :doctor, optional: true
  belongs_to :incident_report, optional: true

  validates :hospital_name, presence: true

  scope :includes_associated, -> { includes(:client, :doctor, :incident_report) }
end
