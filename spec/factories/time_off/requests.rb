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
FactoryBot.define do
  factory :time_off_request, class: "TimeOff::Request" do
    employee
    kind { :pto }
    starts_at { 1.week.from_now.change(hour: 9) }
    ends_at { 1.week.from_now.change(hour: 17) }
    hours { 8.0 }
    status { :pending }
  end
end
