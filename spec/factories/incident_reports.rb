# == Schema Information
#
# Table name: incident_reports
#
#  id                 :uuid             not null, primary key
#  agency_notified_at :datetime
#  description        :text
#  location           :string
#  occurred_at        :datetime
#  reported_at        :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  category_id        :uuid             not null
#  client_id          :uuid             not null
#  reported_by_id     :uuid             not null
#  reported_to_id     :uuid             not null
#
# Indexes
#
#  index_incident_reports_on_category_id     (category_id)
#  index_incident_reports_on_client_id       (client_id)
#  index_incident_reports_on_reported_by_id  (reported_by_id)
#  index_incident_reports_on_reported_to_id  (reported_to_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (reported_by_id => people.id)
#  fk_rails_...  (reported_to_id => people.id)
#
FactoryBot.define do
  factory :incident_report do
    occurred_at { 1.day.ago }
    reported_at { 1.day.ago }
    agency_notified_at { 1.day.ago }
    location { Faker::Address.city }

    transient do
      reported_by_employee { nil }
      reported_to_employee { nil }
    end

    after(:build) do |incident_report, evaluator|
      if evaluator.reported_by_employee
        incident_report.reported_by_id = evaluator.reported_by_employee.person_id
      elsif incident_report.reported_by_id.blank?
        reported_by_employee = create(:employee, :employed)
        incident_report.reported_by_id = reported_by_employee.person_id
      end

      if evaluator.reported_to_employee
        incident_report.reported_to_id = evaluator.reported_to_employee.person_id
      elsif incident_report.reported_to_id.blank?
        reported_to_employee = create(:employee, :employed)
        incident_report.reported_to_id = reported_to_employee.person_id
      end
    end

    client
    category factory: %i[category incident_report]
  end
end
