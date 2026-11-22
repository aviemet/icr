class Calendar::Events::PersistedSerializer < Calendar::EventSerializer
  include Persisted

  attributes(
    starts_at: { type: "Date", optional: false },
    ends_at: { type: "Date", optional: false },
    master_id: { type: :string },
    occurrence_starts_at: { type: "Date" },
  )

  attribute :is_recurring, type: :boolean do
    @object.recurring?
  end
end
