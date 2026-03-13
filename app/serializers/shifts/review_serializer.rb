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
end
