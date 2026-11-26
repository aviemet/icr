# frozen_string_literal: true

# == Schema Information
#
# Table name: time_off_requests
#
#  id          :uuid             not null, primary key
#  ends_at     :datetime         not null
#  hours       :decimal(8, 2)    not null
#  kind        :integer          not null
#  review_note :text
#  reviewed_at :datetime
#  starts_at   :datetime         not null
#  status      :integer          default("pending"), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  employee_id :uuid             not null
#  shift_id    :uuid
#
# Indexes
#
#  index_time_off_requests_on_employee_id             (employee_id)
#  index_time_off_requests_on_employee_id_and_status  (employee_id,status)
#  index_time_off_requests_on_shift_id                (shift_id)
#  index_time_off_requests_on_status                  (status)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (shift_id => shifts.id)
#
module TimeOff
  class RequestSerializer < ApplicationSerializer
    attributes(
      :id,
      :kind,
      :starts_at,
      :ends_at,
      :hours,
      :status,
      :reviewed_at,
      :review_note,
      :shift_id,
      :employee_id,
      :created_at,
      :updated_at,
    )
  end
end
