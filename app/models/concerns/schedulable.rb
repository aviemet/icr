module Schedulable
  extend ActiveSupport::Concern

  included do
    has_one :calendar_event, as: :schedulable, dependent: :nullify

    accepts_nested_attributes_for :calendar_event

    validates :calendar_event, presence: true

    delegate :before, :after, :between, to: :calendar_event, allow_nil: true
  end
end
