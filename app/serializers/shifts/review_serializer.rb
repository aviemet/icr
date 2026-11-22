class Shifts::ReviewSerializer < ShiftSerializer
  include Persisted

  attributes(
    starts_at: { type: "Date" },
    ends_at: { type: "Date" },
  )

  type :string
  def client_name
    clients = shift.calendar_event&.clients

    clients.map(&:full_name).compact.join(", ")
  end

  type :string
  def client_slug
    shift.calendar_event&.clients&.first&.slug
  end

  type "({ id: string, name: string, initials: string, edited_at: string } | null)", optional: true
  def last_editor
    shift.instance_variable_get(:@_last_editor)
  end
end
