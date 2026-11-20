# == Schema Information
#
# Table name: employee_offers
#
#  id                :uuid             not null, primary key
#  employee_number   :string
#  notes             :text
#  period            :integer          default("hourly"), not null
#  proposed_start_on :date
#  rate_cents        :integer          default(0), not null
#  rate_currency     :string           default("USD"), not null
#  status            :integer          default("draft"), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  employee_id       :uuid             not null
#  job_title_id      :uuid             not null
#
# Indexes
#
#  index_employee_offers_on_employee_id             (employee_id)
#  index_employee_offers_on_employee_id_and_status  (employee_id,status)
#  index_employee_offers_on_job_title_id            (job_title_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (job_title_id => job_titles.id)
#
FactoryBot.define do
  factory :employee_offer, class: "Employee::Offer" do
    employee
    job_title
    proposed_start_on { Date.current + 14 }
    rate_cents { 2500 }
    rate_currency { "USD" }
    period { :hourly }
    status { :draft }
    employee_number { "EMP-#{SecureRandom.hex(3).upcase}" }
    notes { "Factory offer" }

    trait :extended do
      status { :extended }
    end

    trait :negotiating do
      status { :negotiating }
    end

    trait :accepted do
      status { :accepted }
    end
  end
end
