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

RSpec.describe Employee::EmployeesTraining, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
