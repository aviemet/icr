# == Schema Information
#
# Table name: compliance_form_submissions
#
#  id               :uuid             not null, primary key
#  closed_at        :datetime
#  due_on           :date
#  inspected_on     :date
#  started_via      :integer          default("manual"), not null
#  status           :integer          default("draft"), not null
#  submitted_at     :datetime
#  template_version :integer          default(1), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  client_id        :uuid
#  conducted_by_id  :uuid
#  form_template_id :uuid             not null
#  household_id     :uuid
#
# Indexes
#
#  idx_on_form_template_id_client_id_status_362b89fc42     (form_template_id,client_id,status)
#  idx_on_form_template_id_household_id_status_cf1550f51b  (form_template_id,household_id,status)
#  index_compliance_form_submissions_on_client_id          (client_id)
#  index_compliance_form_submissions_on_conducted_by_id    (conducted_by_id)
#  index_compliance_form_submissions_on_due_on             (due_on)
#  index_compliance_form_submissions_on_form_template_id   (form_template_id)
#  index_compliance_form_submissions_on_household_id       (household_id)
#  index_compliance_form_submissions_on_status             (status)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (conducted_by_id => employees.id)
#  fk_rails_...  (form_template_id => compliance_form_templates.id)
#  fk_rails_...  (household_id => households.id)
#
module Compliance
  class FormSubmission < ApplicationRecord
    self.table_name = "compliance_form_submissions"

    resourcify

    belongs_to :form_template, class_name: "Compliance::FormTemplate", inverse_of: :form_submissions
    belongs_to :household, optional: true
    belongs_to :client, optional: true
    belongs_to :conducted_by, class_name: "Employee", optional: true

    has_many :form_answers,
             class_name: "Compliance::FormAnswer",
             dependent: :destroy,
             inverse_of: :form_submission
    has_many :corrective_actions,
             class_name: "Compliance::CorrectiveAction",
             dependent: :destroy,
             inverse_of: :form_submission

    accepts_nested_attributes_for :form_answers, allow_destroy: false
    accepts_nested_attributes_for :corrective_actions, allow_destroy: true

    enum :status, {
      draft: 0,
      submitted: 1,
      closed: 2,
    }

    enum :started_via, {
      manual: 0,
      quarterly: 1,
      initial: 2,
      incident: 3,
      new_hazard: 4,
    }, prefix: true

    validates :template_version, presence: true
    validate :subject_present
    validate :inspected_on_present_when_submitted

    scope :includes_associated, -> {
      includes(
        :form_template,
        :household,
        :client,
        :conducted_by,
        form_answers: :form_item,
        corrective_actions: :incident_report,
      )
    }
    scope :incomplete, -> { where(status: :draft) }
    scope :open_statuses, -> { where(status: [:draft, :submitted]) }
    scope :due_or_overdue, ->(on = Date.current) {
      open_statuses.where.not(due_on: nil).where(due_on: ..on)
    }
    scope :for_client_ids, ->(client_ids) {
      where(client_id: client_ids).or(where(household_id: HouseholdsClient.where(client_id: client_ids).select(:household_id)))
    }

    def subject_label
      return household.name if household.present?
      return client.person&.name if client.present?

      "-"
    end

    def overdue?(on = Date.current)
      due_on.present? && due_on < on && !closed?
    end

    def failing_checks?
      form_answers.joins(:form_item).exists?(compliance_form_items: { kind: Compliance::FormItem.kinds[:boolean_check] }, check_value: Compliance::FormAnswer.check_values[:fail])
    end

    def submit!
      self.status = :submitted
      self.submitted_at = Time.current
      self.inspected_on ||= Date.current
      save!
    end

    def close!
      self.status = :closed
      self.closed_at = Time.current
      save!
    end

    private

    def subject_present
      return if household_id.present? || client_id.present?

      errors.add(:base, "household or client is required")
    end

    def inspected_on_present_when_submitted
      return unless submitted? || closed?
      return if inspected_on.present?

      errors.add(:inspected_on, "must be present when submitted")
    end
  end
end
