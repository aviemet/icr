# == Schema Information
#
# Table name: shifts
#
#  id                :uuid             not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#  employee_id       :uuid             not null
#
# Indexes
#
#  index_shifts_on_calendar_event_id  (calendar_event_id)
#  index_shifts_on_employee_id        (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#  fk_rails_...  (employee_id => employees.id)
#
require "rails_helper"

RSpec.describe Shift do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:shift)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i().each do |attr|
        expect(build(:shift, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:employee) }
    it { is_expected.to belong_to(:calendar_event) }
  end
end
