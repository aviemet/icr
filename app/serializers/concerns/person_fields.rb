module PersonFields
  extend ActiveSupport::Concern

  included do
    attributes(
      name: { type: :string },
      full_name: { type: :string },
      first_name: { type: :string },
      last_name: { type: :string },
    )
  end
end
