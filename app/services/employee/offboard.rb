class Employee::Offboard
  def self.call(employee:, attrs:, terminate_immediately: false)
    new(employee:, attrs:, terminate_immediately:).call
  end

  def initialize(employee:, attrs:, terminate_immediately: false)
    @employee = employee
    @attrs = attrs.to_h.with_indifferent_access
    @terminate_immediately = ActiveModel::Type::Boolean.new.cast(terminate_immediately)
  end

  def call
    effective_at = resolve_effective_at
    raise ArgumentError, "inactive_at is required" if effective_at.blank?

    assignable = {
      inactive_at: effective_at,
      termination_reason: attrs[:termination_reason],
    }
    if attrs.key?(:eligible_for_hire)
      assignable[:eligible_for_hire] = ActiveModel::Type::Boolean.new.cast(attrs[:eligible_for_hire])
    end

    if terminate_immediately || effective_at <= Time.current
      terminate_now!(assignable)
    else
      schedule!(assignable, effective_at)
    end

    employee
  end

  private

  attr_reader :employee, :attrs, :terminate_immediately

  def resolve_effective_at
    date_value = attrs[:inactive_at].presence
    return nil if date_value.blank?

    date = parse_date(date_value)
    return nil if date.blank?

    time_value = attrs[:inactive_at_time].to_s.strip
    if time_value.present?
      hour, minute = parse_time_parts(time_value)
      return nil if hour.nil?

      Time.zone.local(date.year, date.month, date.day, hour, minute, 0)
    else
      date.in_time_zone(Time.zone).beginning_of_day
    end
  end

  def parse_date(value)
    case value
    when Date
      value
    when Time, ActiveSupport::TimeWithZone
      value.in_time_zone(Time.zone).to_date
    else
      Time.zone.parse(value.to_s)&.to_date
    end
  end

  def parse_time_parts(value)
    match = value.match(/\A(\d{1,2}):(\d{2})\z/)
    return [nil, nil] unless match

    [match[1].to_i, match[2].to_i]
  end

  def terminate_now!(assignable)
    employee.assign_attributes(assignable)
    employee.terminate!
  end

  def schedule!(assignable, effective_at)
    employee.update!(assignable)
    Employee::TerminateJob.set(wait_until: effective_at).perform_later(employee.id)
  end
end
