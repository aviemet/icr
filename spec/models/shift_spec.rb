# == Schema Information
#
# Table name: shifts
#
#  id                :uuid             not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_entry_id :uuid             not null
#  employee_id       :uuid             not null
#
# Indexes
#
#  index_shifts_on_calendar_entry_id  (calendar_entry_id)
#  index_shifts_on_employee_id        (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_entry_id => calendar_entries.id)
#  fk_rails_...  (employee_id => employees.id)
#
require 'rails_helper'

RSpec.describe Shift do
  pending "add some examples to (or delete) #{__FILE__}"
end
