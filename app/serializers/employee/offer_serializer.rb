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
class Employee::OfferSerializer < ApplicationSerializer
  object_as :offer, model: "Employee::Offer"

  attributes(
    :employee_id,
    :job_title_id,
    :proposed_start_on,
    :rate_cents,
    :rate_currency,
    :period,
    :employee_number,
    :status,
    :notes,
  )

  type :string, optional: false
  def rate
    @object.rate.to_s
  end

  belongs_to :job_title, serializer: Employee::JobTitleSerializer
end
