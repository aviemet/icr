module Shiftable
  extend ActiveSupport::Concern

  included do
    include Participantable

    def shifts
      events.where(category: Category.find_by(slug: "event-shift"))
    end
  end
end
