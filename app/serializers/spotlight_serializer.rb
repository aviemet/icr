class SpotlightSerializer < ApplicationSerializer
  include Persisted

  attribute :type do
    self.class::SPOTLIGHT_TYPE
  end
end

