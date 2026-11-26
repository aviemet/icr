# frozen_string_literal: true

module TimeOff
  module Requests
    class IndexSerializer < ApplicationSerializer
      attributes(
        id: { type: :string },
        kind: { type: :string },
        starts_at: { type: :datetime },
        ends_at: { type: :datetime },
        hours: { type: :number },
        status: { type: :string },
        reviewed_at: { type: :datetime, optional: true },
        review_note: { type: :string, optional: true },
        shift_id: { type: :string, optional: true },
        employee_id: { type: :string },
        created_at: { type: :datetime },
      )

      has_one :employee, serializer: Employees::PersistedSerializer
    end
  end
end
