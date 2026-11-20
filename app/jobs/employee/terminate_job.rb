class Employee::TerminateJob < ApplicationJob
  include GoodJob::ActiveJobExtensions::Concurrency

  queue_as :default

  good_job_concurrency_rule(
    total_limit: 1,
    apply_label: true,
    label: -> { self.class.label_for(arguments.first) },
  )

  def self.label_for(employee_id)
    "employee-terminate-#{employee_id}"
  end

  def perform(employee_id)
    employee = Employee.find_by(id: employee_id)
    return if employee.blank?
    return unless employee.employed?
    return if employee.inactive_at.blank?
    return if employee.inactive_at > Time.current

    employee.terminate!
  end
end
