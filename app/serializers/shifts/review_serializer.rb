class Shifts::ReviewSerializer < ShiftSerializer
  include Persisted

  attributes(
    :facilitator_approved_at,
    :ihss,
    starts_at: { type: "Date" },
    ends_at: { type: "Date" },
  )

  type :string
  def shift_id
    shift.respond_to?(:shift_id) ? shift.shift_id.to_s : shift.id.to_s
  end

  attribute :is_recurring, type: :boolean do
    shift.respond_to?(:recurring_occurrence?) ? shift.recurring_occurrence? : false
  end

  type "Date", optional: true
  def occurrence_starts_at
    return unless shift.respond_to?(:occurrence_starts_at)

    shift.occurrence_starts_at
  end

  type :string
  def client_name
    clients = shift.calendar_event&.clients

    clients.map(&:full_name).compact.join(", ")
  end

  type :string
  def client_slug
    shift.calendar_event&.clients&.first&.slug
  end

  type :string
  def employee_name
    shift.employee&.full_name.presence || shift.employee&.name || "-"
  end

  type "({ id: string, name: string, initials: string, edited_at: string } | null)", optional: true
  def last_editor
    shift.instance_variable_get(:@_last_editor)
  end
end
