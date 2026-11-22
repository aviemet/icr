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
FactoryBot.define do
  factory :client_hospital_visit, class: "Client::HospitalVisit" do
    client
    hospital_name { "General Hospital" }
    admitted_at { 1.day.ago }
    reason { "Observation" }
  end
end
