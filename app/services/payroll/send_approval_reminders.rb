# frozen_string_literal: true

module Payroll
  class SendApprovalReminders
    def self.call
      new.call
    end

    def call
      return unless Setting.notifications_payroll_approval_reminders

      candidate_periods.find_each do |pay_period|
        due_date = Period.payroll_due_date(pay_period.ends_at.to_date)
        period_url = Rails.application.routes.url_helpers.period_url(
          pay_period,
          host: default_host,
          port: default_port,
          protocol: default_protocol,
        )

        recipients_for(pay_period).each do |user, pending_count|
          next if pending_count < 1
          next if user.email.blank?

          PayrollMailer.with(
            user: user,
            pay_period: pay_period,
            pending_count: pending_count,
            due_date: due_date,
            period_url: period_url,
          ).approval_reminder.deliver_later
        end
      end
    end

    private

    def candidate_periods
      PayPeriod
        .where(finalized_at: nil)
        .where(ends_at: ...Date.current.beginning_of_day)
        .where(
          id: Timesheet.where(approved_at: nil).select(:pay_period_id),
        )
    end

    def recipients_for(pay_period)
      results = {}
      director_pending_ids = director_pending_employee_ids(pay_period)
      return results if director_pending_ids.empty?

      admin_users.find_each do |user|
        results[user] = director_pending_ids.size
      end

      Employee.where(id: approver_employee_ids).includes(:person, :job_title, :managed_employees_managers, :active_clients_managers).find_each do |employee|
        user = employee.person&.user
        next if user.blank?
        next if results.key?(user)

        job_title = employee.job_title
        next if job_title.blank?
        next unless job_title.has_role?(:update, Timesheet)

        pending_count = if job_title.has_role?(:index, Timesheet)
                          director_pending_ids.size
                        else
                          facilitator_pending_shift_count(pay_period, employee, director_pending_ids)
                        end

        results[user] = pending_count
      end

      results
    end

    def director_pending_employee_ids(pay_period)
      Timesheet
        .where(pay_period_id: pay_period.id, approved_at: nil)
        .pluck(:employee_id)
    end

    def facilitator_pending_shift_count(pay_period, employee, director_pending_ids)
      managed_client_ids = employee.managed_clients.pluck(:id)
      return 0 if managed_client_ids.empty?

      shifts = PayPeriod.shifts_overlapping_period(pay_period)
        .where(employee_id: director_pending_ids)
        .joins(calendar_event: :event_participants)
        .where(
          event_participants: {
            participant_type: "Client",
            participant_id: managed_client_ids,
          },
        )
        .includes(calendar_event: [:recurring_patterns, :event_exceptions])
        .distinct
        .to_a

      pay_period.shift_occurrences(shifts).count { |occurrence| !occurrence.facilitator_approved? }
    end

    def admin_users
      User.with_role(:admin)
    end

    def approver_employee_ids
      job_title_ids = Employee::JobTitle.with_role(:update, Timesheet).select(:id)

      Employee
        .actively_employed
        .joins(:active_employees_job_title)
        .where(employees_job_titles: { job_title_id: job_title_ids })
        .distinct
        .pluck(:id)
    end

    def default_host
      ActionMailer::Base.default_url_options[:host] || "localhost"
    end

    def default_port
      ActionMailer::Base.default_url_options[:port]
    end

    def default_protocol
      ActionMailer::Base.default_url_options[:protocol] || "http"
    end
  end
end
