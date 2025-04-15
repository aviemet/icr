# == Schema Information
#
# Table name: overtime_exemptions
#
#  id         :uuid             not null, primary key
#  active     :boolean          default(TRUE), not null
#  criteria   :jsonb            not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class OvertimeExemption < ApplicationRecord
  tracked
  validates :name, presence: true
  validates :criteria, presence: true

  # Validate the structure of the criteria JSON
  validate :validate_criteria_structure

  # Evaluates if a shift matches this exemption's criteria
  def matches?(shift)
    # Any group of criteria matching makes the shift exempt
    criteria.any? do |criterion_group|
      # All criteria within a group must match
      criterion_group.all? do |field, conditions|
        evaluate_criterion(shift, field, conditions)
      end
    end
  end

  private

  def evaluate_criterion(shift, field, conditions)
    operator = conditions["operator"]
    value = conditions["value"]

    case field
    when "category"
      evaluate_equality(shift.category, value, operator)
    when "start_time"
      evaluate_time(shift.start_time, value, operator)
    when "end_time"
      evaluate_time(shift.end_time, value, operator)
    when "duration"
      evaluate_numeric(shift.duration_hours, value, operator)
    else
      false
    end
  end

  def evaluate_equality(actual, expected, operator)
    case operator
    when "equals"
      actual == expected
    when "not_equals"
      actual != expected
    when "in"
      expected.include?(actual)
    else
      false
    end
  end

  def evaluate_time(actual_time, expected, operator)
    case operator
    when "equals"
      actual_time.strftime("%H:%M") == expected
    when "before"
      time_before?(actual_time, parse_time(expected))
    when "after"
      time_after?(actual_time, parse_time(expected))
    when "between"
      start_time = parse_time(expected[0])
      end_time = parse_time(expected[1])

      if start_time < end_time
        # Same day range (e.g. 09:00-17:00)
        time_between?(actual_time, start_time, end_time)
      else
        # Overnight range (e.g. 22:00-06:00)
        time_after?(actual_time, start_time) || time_before?(actual_time, end_time)
      end
    else
      false
    end
  end

  def parse_time(time_str)
    hour, minute = time_str.split(":").map(&:to_i)
    Time.current.change(hour: hour, min: minute)
  end

  def time_before?(time1, time2)
    time1.strftime("%H:%M") < time2.strftime("%H:%M")
  end

  def time_after?(time1, time2)
    time1.strftime("%H:%M") > time2.strftime("%H:%M")
  end

  def time_between?(time, start_time, end_time)
    time_str = time.strftime("%H:%M")
    start_str = start_time.strftime("%H:%M")
    end_str = end_time.strftime("%H:%M")

    time_str >= start_str && time_str <= end_str
  end

  def evaluate_numeric(actual, expected, operator)
    case operator
    when "equals"
      actual == expected
    when "greater_than"
      actual > expected
    when "less_than"
      actual < expected
    when "greater_than_equal"
      actual >= expected
    when "less_than_equal"
      actual <= expected
    when "between"
      actual >= expected[0] && actual <= expected[1]
    else
      false
    end
  end

  def validate_criteria_structure
    unless criteria.is_a?(Array)
      errors.add(:criteria, "must be an array of criterion groups")
      return
    end

    criteria.each_with_index do |group, group_index|
      unless group.is_a?(Hash)
        errors.add(:criteria, "group #{group_index} must be a hash of criteria")
        next
      end

      group.each do |field, conditions|
        validate_criterion_conditions(field, conditions, group_index)
      end
    end
  end

  def validate_criterion_conditions(field, conditions, group_index)
    unless valid_field?(field)
      errors.add(:criteria, "invalid field '#{field}' in group #{group_index}")
      return
    end

    unless conditions.is_a?(Hash) && conditions["operator"].present? && conditions["value"].present?
      errors.add(:criteria, "invalid conditions for '#{field}' in group #{group_index}")
      return
    end

    unless valid_operator?(field, conditions["operator"])
      errors.add(:criteria, "invalid operator '#{conditions['operator']}' for '#{field}' in group #{group_index}")
    end

    unless valid_value?(field, conditions["operator"], conditions["value"])
      errors.add(:criteria, "invalid value for '#{field}' with operator '#{conditions['operator']}' in group #{group_index}")
    end
  end

  def valid_field?(field)
    %w[category start_time end_time duration].include?(field)
  end

  def valid_operator?(field, operator)
    case field
    when "category"
      %w[equals not_equals in].include?(operator)
    when "start_time", "end_time"
      %w[equals before after between].include?(operator)
    when "duration"
      %w[equals greater_than less_than greater_than_equal less_than_equal between].include?(operator)
    else
      false
    end
  end

  def valid_value?(field, operator, value)
    case field
    when "category"
      case operator
      when "equals", "not_equals"
        value.is_a?(String)
      when "in"
        value.is_a?(Array) && value.all?(String)
      end
    when "start_time", "end_time"
      case operator
      when "equals", "before", "after"
        valid_time_string?(value)
      when "between"
        value.is_a?(Array) && value.length == 2 && value.all? { |v| valid_time_string?(v) }
      end
    when "duration"
      case operator
      when "equals", "greater_than", "less_than", "greater_than_equal", "less_than_equal"
        value.is_a?(Numeric)
      when "between"
        value.is_a?(Array) && value.length == 2 && value.all?(Numeric)
      end
    else
      false
    end
  end

  def valid_time_string?(value)
    return false unless value.is_a?(String)

    # Check if string matches HH:MM format
    /\A([0-1][0-9]|2[0-3]):[0-5][0-9]\z/.match?(value)
  end
end
