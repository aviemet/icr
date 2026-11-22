class Calendar::Events::PersistedSerializer < Calendar::EventSerializer
  include Persisted

  attributes(
    starts_at: { type: "Date", optional: false },
    ends_at: { type: "Date", optional: false },
    master_id: { type: :string },
    occurrence_starts_at: { type: "Date" },
    is_recurring: { type: :boolean },
  )
end
