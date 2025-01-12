# == Schema Information
#
# Table name: shift_template_entries
#
#  id                :uuid             not null, primary key
#  day_of_week       :integer
#  ends_at           :time
#  starts_at         :time
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  employee_id       :uuid             not null
#  shift_template_id :uuid             not null
#
# Indexes
#
#  index_shift_template_entries_on_employee_id        (employee_id)
#  index_shift_template_entries_on_shift_template_id  (shift_template_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (shift_template_id => shift_templates.id)
#
require 'rails_helper'

RSpec.describe ShiftTemplateEntry, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
