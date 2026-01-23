# == Schema Information
#
# Table name: timesheet_hours
#
#  id           :uuid             not null, primary key
#  ended_at     :datetime         not null
#  hours        :decimal(4, 2)    not null
#  started_at   :datetime         not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  employee_id  :uuid             not null
#  timesheet_id :uuid             not null
#
# Indexes
#
#  idx_timesheet_hours_unique_day         (timesheet_id,employee_id,started_at) UNIQUE
#  index_timesheet_hours_on_employee_id   (employee_id)
#  index_timesheet_hours_on_timesheet_id  (timesheet_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (timesheet_id => timesheets.id)
#
require "rails_helper"

RSpec.describe TimesheetHour do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:timesheet_hour)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(started_at ended_at hours).each do |attr|
        expect(build(:timesheet_hour, attr => nil)).not_to be_valid
      end
    end

    it "is invalid when duplicate entry exists for same timesheet, employee, and started_at" do
      timesheet = create(:timesheet)
      employee = create(:employee)
      started_at = Time.current.beginning_of_day

      create(:timesheet_hour,
        timesheet: timesheet,
        employee: employee,
        started_at: started_at,
      )

      duplicate = build(:timesheet_hour,
        timesheet: timesheet,
        employee: employee,
        started_at: started_at,
      )

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:started_at]).to be_present
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:timesheet) }
    it { is_expected.to belong_to(:employee) }
  end
end
