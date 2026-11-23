module Compliance
  class Queue
    Row = Struct.new(
      :submission,
      :subject_label,
      :template_name,
      :due_on,
      :status,
      :overdue,
      :open_corrective_actions_count,
      keyword_init: true,
    )

    def self.for_user(user, as_of: Date.current)
      new(user: user, as_of: as_of).rows
    end

    def initialize(user:, as_of:)
      @user = user
      @as_of = as_of
    end

    def rows
      Compliance::EnsureDueSubmissions.call(as_of: @as_of)

      submissions = policy_scope_submissions.includes_associated.order(due_on: :asc, created_at: :asc)
      submissions.map { |submission| build_row(submission) }
    end

    private

    def policy_scope_submissions
      Pundit.policy_scope!(@user, Compliance::FormSubmission)
    end

    def build_row(submission)
      Row.new(
        submission: submission,
        subject_label: submission.subject_label,
        template_name: submission.form_template.name,
        due_on: submission.due_on,
        status: submission.status,
        overdue: submission.overdue?(@as_of),
        open_corrective_actions_count: submission.corrective_actions.count(&:open?),
      )
    end
  end
end
