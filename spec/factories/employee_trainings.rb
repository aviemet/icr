# == Schema Information
#
# Table name: employee_trainings
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
#  index_employee_trainings_on_employee_id                  (employee_id)
#  index_employee_trainings_on_employee_id_and_training_id  (employee_id,training_id) UNIQUE
#  index_employee_trainings_on_training_id                  (training_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (training_id => employee_trainings.id)
#
FactoryBot.define do
  factory :employee_training do
    employee { nil }
    training { nil }
    completed_at { "2025-04-17 16:31:07" }
  end
end
