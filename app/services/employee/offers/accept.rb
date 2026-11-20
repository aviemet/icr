class Employee::Offers::Accept
  def self.call(offer:)
    new(offer:).call
  end

  def initialize(offer:)
    @offer = offer
    @employee = offer.employee
  end

  def call
    raise ArgumentError, "Offer is not open" unless offer.open?

    ActiveRecord::Base.transaction do
      if employee.employed?
        apply_promotion_terms!
      else
        apply_hire_terms!
      end

      offer.update!(status: :accepted)
    end

    offer
  end

  private

  attr_reader :offer, :employee

  def apply_hire_terms!
    employee.assign_attributes(
      active_at: offer.proposed_start_on.presence || employee.active_at,
      number: offer.employee_number.presence || employee.number,
      inactive_at: nil,
    )

    if employee.applicant? && employee.may_make_offer?
      employee.make_offer!
    end

    if employee.offered?
      employee.accept_offer!
    elsif employee.applicant? && employee.may_begin_employment?
      employee.begin_employment!
    else
      employee.save!
    end

    apply_job_title_and_pay!(application_type: :new_hire)
  end

  def apply_promotion_terms!
    apply_job_title_and_pay!(application_type: :position_change)
  end

  def apply_job_title_and_pay!(application_type:)
    starts_at = offer.proposed_start_on.beginning_of_day
    employee.assign_job_title(
      offer.job_title,
      starts_at: starts_at,
      application_type: application_type,
    )

    current_pay = employee.pay_rates.where("starts_at <= ? AND ends_at IS NULL", starts_at).first
    current_pay&.update!(ends_at: starts_at)

    employee.pay_rates.create!(
      rate_cents: offer.rate_cents,
      rate_currency: offer.rate_currency,
      period: offer.period,
      starts_at: starts_at,
    )
  end
end
