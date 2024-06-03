# == Schema Information
#
# Table name: cal_events
#
#  id                   :bigint           not null, primary key
#  ends_at              :datetime
#  starts_at            :datetime
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  created_by_id        :bigint           not null
#  parent_id            :bigint
#  recurring_pattern_id :bigint
#
# Indexes
#
#  index_cal_events_on_created_by_id         (created_by_id)
#  index_cal_events_on_parent_id             (parent_id)
#  index_cal_events_on_recurring_pattern_id  (recurring_pattern_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (parent_id => cal_events.id)
#  fk_rails_...  (recurring_pattern_id => recurring_patterns.id)
#
require 'rails_helper'

RSpec.describe CalEvent, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end