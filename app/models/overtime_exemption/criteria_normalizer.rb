class OvertimeExemption
  class CriteriaNormalizer
    def self.call(criteria)
      new(criteria).call
    end

    def initialize(criteria)
      @criteria = criteria
    end

    def call
      Array(@criteria).map { |group| normalize_group(group) }
    end

    private

    def normalize_group(group)
      hash = group.respond_to?(:to_unsafe_h) ? group.to_unsafe_h : group
      hash.each_with_object({}) do |(field, conditions), normalized|
        condition_hash = conditions.respond_to?(:to_unsafe_h) ? conditions.to_unsafe_h : conditions
        normalized[field.to_s] = normalize_conditions(field.to_s, condition_hash)
      end
    end

    def normalize_conditions(field, conditions)
      operator = conditions["operator"] || conditions[:operator]
      value = conditions["value"] || conditions[:value]

      {
        "operator" => operator,
        "value" => coerce_value(field, operator, value)
      }
    end

    def coerce_value(field, operator, value)
      return value unless field == "duration"

      if operator == "between" && value.is_a?(Array)
        value.map { |entry| coerce_numeric(entry) }
      else
        coerce_numeric(value)
      end
    end

    def coerce_numeric(value)
      return value if value.is_a?(Numeric)
      return value unless value.is_a?(String) && value.match?(/\A-?\d+(\.\d+)?\z/)

      value.include?(".") ? value.to_f : value.to_i
    end
  end
end
