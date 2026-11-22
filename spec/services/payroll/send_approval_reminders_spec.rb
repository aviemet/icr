# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::SendApprovalReminders do
  include ActiveJob::TestHelper

  let(:period_start) { 20.days.ago.beginning_of_day }
  let(:period_end) { 6.days.ago.end_of_day }

  before do
    ActiveJob::Base.queue_adapter = :test
    clear_enqueued_jobs
    ActionMailer::Base.deliveries.clear
    Setting.notifications_payroll_approval_reminders = true
    Setting.payroll_due_date_rule_type = Setting::PAYROLL_DUE_DATE_RULE_TYPES[:days_after_period_end]
    Setting.payroll_due_date_days = 5
  end

  def create_closed_period(**attrs)
    create(
      :pay_period,
      starts_at: period_start,
      ends_at: period_end,
      finalized_at: nil,
      **attrs,
    )
  end

  def link_user(employee)
    create(:user, person: employee.person)
  end

  def delivered_to
    ActionMailer::Base.deliveries.map(&:to).flatten
  end

  describe ".call" do
    it "sends nothing when notifications are disabled" do
      Setting.notifications_payroll_approval_reminders = false
      pay_period = create_closed_period
      create(:timesheet, pay_period: pay_period, approved_at: nil)
      create(:user).tap { |user| user.add_role(:admin) }

      perform_enqueued_jobs { described_class.call }

      expect(ActionMailer::Base.deliveries).to be_empty
    end

    it "sends nothing for open periods" do
      pay_period = create(
        :pay_period,
        starts_at: 2.days.ago.beginning_of_day,
        ends_at: 5.days.from_now.end_of_day,
        finalized_at: nil,
      )
      create(:timesheet, pay_period: pay_period, approved_at: nil)
      create(:user).tap { |user| user.add_role(:admin) }

      perform_enqueued_jobs { described_class.call }

      expect(ActionMailer::Base.deliveries).to be_empty
    end

    it "sends nothing for finalized periods" do
      pay_period = create_closed_period(finalized_at: 1.day.ago)
      create(:timesheet, pay_period: pay_period, approved_at: nil)
      create(:user).tap { |user| user.add_role(:admin) }

      perform_enqueued_jobs { described_class.call }

      expect(ActionMailer::Base.deliveries).to be_empty
    end

    it "sends nothing when all timesheets are approved" do
      pay_period = create_closed_period
      create(:timesheet, pay_period: pay_period, approved_at: Date.current)
      create(:user).tap { |user| user.add_role(:admin) }

      perform_enqueued_jobs { described_class.call }

      expect(ActionMailer::Base.deliveries).to be_empty
    end

    it "emails admins with the full pending count" do
      pay_period = create_closed_period
      create(:timesheet, pay_period: pay_period, approved_at: nil)
      create(:timesheet, pay_period: pay_period, approved_at: nil)
      admin = create(:user).tap { |user| user.add_role(:admin) }

      perform_enqueued_jobs { described_class.call }

      expect(delivered_to).to eq([admin.email])
      expect(ActionMailer::Base.deliveries.last.subject).to include("2 timesheets")
      expect(ActionMailer::Base.deliveries.last.body.encoded).to include("/payroll/periods/#{pay_period.id}")
    end

    it "emails org-wide approvers with the full pending count" do
      job_title = create(:job_title)
      job_title.add_role(:index, Timesheet)
      job_title.add_role(:update, Timesheet)
      approver = create(:employee, :employed)
      approver.assign_job_title(job_title)
      approver.reload
      user = link_user(approver)

      pay_period = create_closed_period
      create(:timesheet, pay_period: pay_period, approved_at: nil)
      create(:timesheet, pay_period: pay_period, approved_at: nil)

      perform_enqueued_jobs { described_class.call }

      expect(delivered_to).to eq([user.email])
      expect(ActionMailer::Base.deliveries.last.subject).to include("2 timesheets")
    end

    it "emails managed-only approvers with scoped pending count" do
      job_title = create(:job_title)
      job_title.add_role(:update, Timesheet)
      manager = create(:employee, :employed)
      manager.assign_job_title(job_title)
      manager.reload
      user = link_user(manager)

      managed = create(:employee, :employed)
      unmanaged = create(:employee, :employed)
      create(:employees_manager, manager: manager, employee: managed, starts_at: 1.day.ago)

      pay_period = create_closed_period
      create(:timesheet, pay_period: pay_period, employee: managed, approved_at: nil)
      create(:timesheet, pay_period: pay_period, employee: unmanaged, approved_at: nil)

      perform_enqueued_jobs { described_class.call }

      expect(delivered_to).to eq([user.email])
      expect(ActionMailer::Base.deliveries.last.subject).to include("1 timesheet")
    end

    it "skips managed-only approvers with no pending reports" do
      job_title = create(:job_title)
      job_title.add_role(:update, Timesheet)
      manager = create(:employee, :employed)
      manager.assign_job_title(job_title)
      manager.reload
      link_user(manager)

      unmanaged = create(:employee, :employed)
      pay_period = create_closed_period
      create(:timesheet, pay_period: pay_period, employee: unmanaged, approved_at: nil)

      perform_enqueued_jobs { described_class.call }

      expect(ActionMailer::Base.deliveries).to be_empty
    end
  end
end
