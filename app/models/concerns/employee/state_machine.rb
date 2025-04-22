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
      state :application_withdrawn

      event :make_offer do
        transitions from: :applicant,
          to: :offered,
          after: :make_offer,
          guard: :eligible_for_hire?
      end

      event :close_application do
        transitions from: :applicant,
          to: :application_withdrawn
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
        transitions from: [:declined, :terminated, :application_withdrawn],
          to: :applicant,
          after: :make_offer,
          guard: :eligible_for_hire?
      end
    end

    def activate_employment
      update(active_at: Time.current, inactive_at: nil)
    end

    def deactivate_employment
      now = Time.current
      update(inactive_at: now)

      current_job_assignment = employees_job_titles.where("starts_at <= ? AND ends_at IS NULL", now).first
      current_job_assignment&.update(ends_at: now)

      current_pay_rate = pay_rates.where("starts_at <= ? AND ends_at IS NULL", now).first
      current_pay_rate&.update(ends_at: now)
    end

    def make_offer
    end

    def offer_declined
    end
  end
end
