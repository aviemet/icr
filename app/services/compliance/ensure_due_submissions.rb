module Compliance
  class EnsureDueSubmissions
    def self.call(as_of: Date.current, template: nil)
      new(as_of: as_of, template: template).call
    end

    def initialize(as_of:, template:)
      @as_of = as_of
      @template = template || Compliance::FormTemplate.active.find_by(slug: HazardAssessmentSeed::TEMPLATE_SLUG)
    end

    def call
      return [] if @template.blank?
      return ensure_for_households if @template.subject_household?

      ensure_for_clients
    end

    private

    def ensure_for_households
      Household.find_each.filter_map { |household| ensure_subject(household: household, client: household.clients.first) }
    end

    def ensure_for_clients
      Client.find_each.filter_map { |client| ensure_subject(household: client.household, client: client) }
    end

    def ensure_subject(household:, client:)
      return if household.blank? && client.blank?

      open_submission = open_for(household: household, client: client)
      return if open_submission.present?

      last_submitted = last_submitted_for(household: household, client: client)
      due_on = next_due_on(last_submitted)
      return if due_on > @as_of

      Compliance::FormSubmission.create!(
        form_template: @template,
        household: household,
        client: client,
        due_on: due_on,
        status: :draft,
        started_via: last_submitted.blank? ? :initial : :quarterly,
        template_version: @template.form_version,
      )
    end

    def submissions_scope
      Compliance::FormSubmission.where(form_template_id: @template.id)
    end

    def open_for(household:, client:)
      scope = submissions_scope.incomplete
      if household.present?
        scope.find_by(household_id: household.id)
      else
        scope.find_by(client_id: client.id)
      end
    end

    def last_submitted_for(household:, client:)
      scope = submissions_scope.where(status: [:submitted, :closed]).order(inspected_on: :desc, submitted_at: :desc)
      if household.present?
        scope.find_by(household_id: household.id)
      else
        scope.find_by(client_id: client.id)
      end
    end

    def next_due_on(last_submitted)
      interval = @template.cadence_interval
      return @as_of if interval.blank?
      return @as_of if last_submitted.blank?

      anchor = last_submitted.inspected_on || last_submitted.submitted_at&.to_date || last_submitted.created_at.to_date
      anchor + interval
    end
  end
end
