# == Schema Information
#
# Table name: shifts
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  cal_event_id :bigint
#  client_id    :bigint
#  employee_id  :bigint
#  household_id :bigint           not null
#
# Indexes
#
#  index_shifts_on_cal_event_id  (cal_event_id)
#  index_shifts_on_client_id     (client_id)
#  index_shifts_on_employee_id   (employee_id)
#  index_shifts_on_household_id  (household_id)
#
# Foreign Keys
#
#  fk_rails_...  (cal_event_id => cal_events.id)
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (household_id => households.id)
#
class Shift < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:cal_event, :client, :employee, :household],
    associated_against: {
      cal_event: [],
      client: [],
      employee: [],
      household: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :cal_event
  belongs_to :client
  belongs_to :employee
  belongs_to :household

  scope :includes_associated, -> { includes([:cal_event, :client, :employee, :household]) }

end
