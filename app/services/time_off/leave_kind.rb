# frozen_string_literal: true

module TimeOff
  module LeaveKind
    SLUG_TO_KIND = {
      "vacation" => :pto,
      "sick" => :sick,
      "holiday" => :holiday,
    }.freeze

    LEAVE_SLUGS = SLUG_TO_KIND.keys.freeze

    module_function

    def from_slug(slug)
      SLUG_TO_KIND[slug.to_s]
    end

    def leave_slug?(slug)
      LEAVE_SLUGS.include?(slug.to_s)
    end

    def bank_for_slug(slug)
      kind = from_slug(slug)
      return nil if kind.nil? || kind == :holiday

      kind
    end
  end
end
