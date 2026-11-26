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

    it "rejects completed_at before started_at" do
      expect(
        build(
          :employees_training,
          started_at: Time.current,
          completed_at: 1.day.ago,
        ),
      ).not_to be_valid
    end

    it "allows completed_at on the same second as started_at" do
      started = Time.zone.parse("2026-01-15 10:00:00.500")
      completed = Time.zone.parse("2026-01-15 10:00:00.000")
      expect(build(:employees_training, started_at: started, completed_at: completed)).to be_valid
    end
  end

  describe "#status" do
    it "returns completed when completed_at is present" do
      expect(build(:employees_training, completed_at: Time.current).status).to eq(:completed)
    end

    it "returns in_progress when started and not completed" do
      expect(build(:employees_training, started_at: Time.current, completed_at: nil).status).to eq(:in_progress)
    end

    it "returns not_started when neither date is present" do
      expect(build(:employees_training, started_at: nil, completed_at: nil).status).to eq(:not_started)
    end
  end
end
