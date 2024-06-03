# == Schema Information
#
# Table name: incident_reports
#
#  id                 :bigint           not null, primary key
#  agency_notified_at :datetime
#  description        :text
#  location           :string
#  occurred_at        :datetime
#  reported_at        :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  client_id          :bigint           not null
#  incident_type_id   :bigint           not null
#  reported_by_id     :bigint           not null
#  reported_to_id     :bigint           not null
#
# Indexes
#
#  index_incident_reports_on_client_id         (client_id)
#  index_incident_reports_on_incident_type_id  (incident_type_id)
#  index_incident_reports_on_reported_by_id    (reported_by_id)
#  index_incident_reports_on_reported_to_id    (reported_to_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (incident_type_id => incident_types.id)
#  fk_rails_...  (reported_by_id => people.id)
#  fk_rails_...  (reported_to_id => people.id)
#
FactoryBot.define do
  factory :incident_report do
    occurred_at { "2024-06-02 15:20:24" }
    reported_by { nil }
    client { nil }
    reported_at { "2024-06-02 15:20:24" }
    agency_notified_at { "2024-06-02 15:20:24" }
    reported_to { nil }
    location { "MyString" }
    incident_type { nil }
  end
end
