# == Schema Information
#
# Table name: interviews
#
#  id           :uuid             not null, primary key
#  notes        :text
#  scheduled_at :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  employee_id  :uuid             not null
#
# Indexes
#
#  index_interviews_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
require 'rails_helper'

RSpec.describe Employee::Interview, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
