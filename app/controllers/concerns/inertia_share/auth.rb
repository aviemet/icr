# frozen_string_literal: true

require "active_support/concern"

module InertiaShare::Auth
  extend ActiveSupport::Concern

  included do
    inertia_share auth: lambda {
      payload = {
        user: current_user&.render(:inertia_share),
        own_employee_slug: current_user&.person&.employee&.slug,
        own_client_slug: current_user&.person&.client&.slug,
      }

      if DevActsAs.enabled? && true_user.present?
        payload[:acts_as] = acts_as_share_payload
      end

      payload
    }

  end

  private

  def acts_as_share_payload
    {
      active: acting_as?,
      true_user: acts_as_user_summary(true_user),
      acting_user: acting_as? ? acts_as_acting_summary(current_user) : nil,
      candidates: acts_as_candidates,
    }
  end

  def acts_as_user_summary(user)
    {
      id: user.id,
      email: user.email,
      name: user.person&.name,
    }
  end

  def acts_as_acting_summary(user)
    acts_as_user_summary(user).merge(
      agency_role: user.person&.agency_role,
      job_title: user.person&.employee&.job_title&.name,
    )
  end

  def acts_as_candidates
    User
      .includes(person: [:client, { employee: :job_title }])
      .order(:email)
      .map { |user| acts_as_candidate_summary(user) }
  end

  def acts_as_candidate_summary(user)
    {
      id: user.id,
      email: user.email,
      name: user.person&.name,
      agency_role: user.person&.agency_role,
      job_title: user.person&.employee&.job_title&.name,
    }
  end
end
