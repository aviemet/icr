# == Schema Information
#
# Table name: employees_trainings
#
#  id           :uuid             not null, primary key
#  completed_at :datetime
#  started_at   :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  employee_id  :uuid             not null
#  training_id  :uuid             not null
#
# Indexes
#
#  index_employees_trainings_on_employee_id                  (employee_id)
#  index_employees_trainings_on_employee_id_and_training_id  (employee_id,training_id) UNIQUE
#  index_employees_trainings_on_training_id                  (training_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (training_id => trainings.id)
#
require "rails_helper"

RSpec.describe Employee::EmployeesTraining do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:employees_training)).to be_valid
    end

    it "is invalid when an employee has duplicate training records" do
      employee = create(:employee)
      training = create(:training)
      create(:employees_training, employee: employee, training: training)

      duplicate = build(:employees_training, employee: employee, training: training)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:training_id]).to be_present
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:employee) }
    it { is_expected.to belong_to(:training) }
  end
end
