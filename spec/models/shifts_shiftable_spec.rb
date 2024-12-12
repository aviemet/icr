# == Schema Information
#
# Table name: shifts_shiftables
#
#  id             :bigint           not null, primary key
#  shiftable_type :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  shift_id       :bigint           not null
#  shiftable_id   :bigint           not null
#
# Indexes
#
#  index_shifts_shiftables_on_shift_id   (shift_id)
#  index_shifts_shiftables_on_shiftable  (shiftable_type,shiftable_id)
#
# Foreign Keys
#
#  fk_rails_...  (shift_id => shifts.id)
#
require 'rails_helper'

RSpec.describe ShiftsShiftable do
  pending "add some examples to (or delete) #{__FILE__}"
end
