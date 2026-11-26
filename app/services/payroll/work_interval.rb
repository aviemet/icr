module Payroll
  WorkInterval = Struct.new(
    :id,
    :employee_id,
    :starts_at,
    :ends_at,
    :category,
    :ihss,
    :client_ids,
    :leave_kind,
    keyword_init: true,
  ) do
    def start_time
      starts_at
    end

    def end_time
      ends_at
    end

    def duration_hours
      return 0 if starts_at.blank? || ends_at.blank?

      (ends_at - starts_at) / 1.hour.to_f
    end

    def ihss?
      ihss == true
    end

    def leave?
      leave_kind.present?
    end

    def client_ids
      Array(self[:client_ids])
    end
  end
end
