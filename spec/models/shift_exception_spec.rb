# == Schema Information
#
# Table name: shift_exceptions
#
#  id          :bigint           not null, primary key
#  cancelled   :datetime
#  ends_at     :datetime
#  rescheduled :datetime
#  starts_at   :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  shift_id    :bigint           not null
#
# Indexes
#
#  index_shift_exceptions_on_shift_id  (shift_id)
#
# Foreign Keys
#
#  fk_rails_...  (shift_id => shifts.id)
#
require "rails_helper"

RSpec.describe ShiftException, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
