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
class Employee::Offer < ApplicationRecord
  self.table_name = "employee_offers"

  OPEN_STATUSES = %w[draft extended negotiating].freeze
  TERMINAL_STATUSES = %w[accepted declined withdrawn].freeze

  belongs_to :employee
  belongs_to :job_title, class_name: "Employee::JobTitle"

  monetize :rate_cents, numericality: { greater_than: 0 }

  enum :period, { hourly: 0, salary: 1 }
  enum :status, {
    draft: 0,
    extended: 1,
    negotiating: 2,
    accepted: 3,
    declined: 4,
    withdrawn: 5,
  }

  validates :proposed_start_on, presence: true
  validates :period, presence: true
  validates :status, presence: true
  validate :only_one_open_offer_per_employee, on: :create

  scope :open, -> { where(status: OPEN_STATUSES) }
  scope :includes_associated, -> { includes([:employee, :job_title]) }

  def open?
    OPEN_STATUSES.include?(status)
  end

  private

  def only_one_open_offer_per_employee
    return if employee.blank?
    return unless open?

    if employee.offers.open.where.not(id: id).exists?
      errors.add(:base, "Employee already has an open offer")
    end
  end
end
