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
require "rails_helper"

RSpec.describe IncidentReport do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:incident_report)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i().each do |attr|
        expect(build(:incident_report, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to belong_to(:reported_by) }
    it{ is_expected.to belong_to(:client) }
    it{ is_expected.to belong_to(:reported_to) }
  end
end
