module Employee::StateMachine
  extend ActiveSupport::Concern

  included do
    include AASM

    aasm column: :status, enum: true do
      state :applicant, initial: true
      state :offered
      state :employed
      state :declined
      state :terminated
      state :withdrawn

      event :make_offer do
        transitions from: :applicant,
          to: :offered,
          after: :make_offer,
          guard: :eligible_for_hire?
      end

      event :begin_employment do
        transitions from: :applicant,
          to: :employed,
          after: :activate_employment,
          guard: :eligible_for_hire?
      end

      event :withdraw_application do
        transitions from: [:applicant, :offered],
          to: :withdrawn
      end

      event :decline_application do
        transitions from: [:applicant, :offered],
          to: :declined
      end

      event :accept_offer do
        transitions from: :offered,
          to: :employed,
          after: :activate_employment
      end

      event :reject_offer do
        transitions from: :offered,
          to: :declined,
          after: :offer_declined
      end

      event :terminate do
        transitions from: [:employed],
          to: :terminated,
          after: :deactivate_employment
      end

      event :reconsider do
        transitions from: [:declined, :terminated, :withdrawn],
          to: :applicant,
          after: :make_offer,
          guard: :eligible_for_hire?
      end
    end

    def activate_employment
      attrs = { inactive_at: nil }
      attrs[:active_at] = Time.current if active_at.blank?
      update(attrs)
    end

    def deactivate_employment
      ends_at = inactive_at.presence || Time.current
      update(inactive_at: ends_at) if inactive_at.blank?

      current_job_assignment = employees_job_titles.where("starts_at <= ? AND ends_at IS NULL", ends_at).first
      current_job_assignment&.update(ends_at: ends_at)

      current_pay_rate = pay_rates.where("starts_at <= ? AND ends_at IS NULL", ends_at).first
      current_pay_rate&.update(ends_at: ends_at)
    end

    def make_offer
    end

    def offer_declined
      self.ineligibility_reason = ineligibility_reason.presence || "Offer declined"
    end
  end
end
