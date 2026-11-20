class Employee::CancelPendingTermination
  def self.call(employee:)
    new(employee:).call
  end

  def initialize(employee:)
    @employee = employee
  end

  def call
    raise ArgumentError, "Employee does not have a pending termination" unless employee.pending_termination?

    employee.update!(inactive_at: nil, termination_reason: nil)
    discard_queued_jobs!
    employee
  end

  private

  attr_reader :employee

  def discard_queued_jobs!
    label = Employee::TerminateJob.label_for(employee.id)
    unfinished = GoodJob::Job.unfinished.where(job_class: "Employee::TerminateJob")

    unfinished
      .labeled(label)
      .or(unfinished.where(concurrency_key: label))
      .find_each do |job|
        job.discard_job("Cancelled pending termination")
      end
  end
end
