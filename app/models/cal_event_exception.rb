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
class CalEventException < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:cal_event, :rescheduled, :cancelled, :starts_at, :ends_at],
    associated_against: {
      cal_event: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :cal_event

  scope :includes_associated, -> { includes([:cal_event]) }
end
