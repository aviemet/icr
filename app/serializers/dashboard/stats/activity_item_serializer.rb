# frozen_string_literal: true

class Dashboard::Stats::ActivityItemSerializer < BaseSerializer
  attributes(
    kind: { type: :string },
    id: { type: :string },
    name: { type: :string },
    created_at: { type: :string },
  )
end
