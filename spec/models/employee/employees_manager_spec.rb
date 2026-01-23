# == Schema Information
#
# Table name: employees_managers
#
#  id          :uuid             not null, primary key
#  ends_at     :datetime
#  primary     :boolean          default(FALSE), not null
#  starts_at   :datetime         not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  employee_id :uuid             not null
#  manager_id  :uuid             not null
#
# Indexes
#
#  index_employees_managers_on_employee_id       (employee_id)
#  index_employees_managers_on_manager_id        (manager_id)
#  index_employees_managers_unique_relationship  (manager_id,employee_id) UNIQUE WHERE (ends_at IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (manager_id => employees.id)
#
require "rails_helper"

RSpec.describe Employee::EmployeesManager do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:employees_manager)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(starts_at).each do |attr|
        expect(build(:employees_manager, attr => nil)).not_to be_valid
      end
    end

    it "is invalid when manager_id equals employee_id" do
      employee = create(:employee)
      manager_record = build(:employees_manager, employee: employee, manager: employee)
      expect(manager_record).not_to be_valid
      expect(manager_record.errors[:base]).to be_present
    end

    it "is invalid when ends_at is before starts_at" do
      manager_record = build(:employees_manager, starts_at: Time.current, ends_at: 1.day.ago)
      expect(manager_record).not_to be_valid
      expect(manager_record.errors[:ends_at]).to include("must be after starts_at")
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:manager).class_name("Employee") }
    it { is_expected.to belong_to(:employee).class_name("Employee") }
  end
end
