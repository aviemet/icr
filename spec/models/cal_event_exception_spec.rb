# == Schema Information
#
# Table name: cal_event_exceptions
#
#  id           :bigint           not null, primary key
#  cancelled    :datetime
#  ends_at      :datetime
#  rescheduled  :datetime
#  starts_at    :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  cal_event_id :bigint           not null
#
# Indexes
#
#  index_cal_event_exceptions_on_cal_event_id  (cal_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (cal_event_id => cal_events.id)
#
require 'rails_helper'

RSpec.describe CalEventException, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
