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
class ShiftException < ApplicationRecord
  include PgSearch::Model
  include PublicActivity::Model

  belongs_to :event
end
