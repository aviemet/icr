class Calendar::Events::PersistedSerializer < Calendar::EventSerializer
  include Persisted

  attributes(
    starts_at: { type: "Date", optional: false },
    ends_at: { type: "Date", optional: false },
  )
end
