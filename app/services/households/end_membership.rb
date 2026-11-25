module Households
  class EndMembership
    def self.call(membership:, ends_at: Date.current)
      new(membership:, ends_at:).call
    end

    def initialize(membership:, ends_at: Date.current)
      @membership = membership
      @ends_at = ends_at
    end

    def call
      membership.update(ends_at: ends_at)
      membership
    end

    private

    attr_reader :membership, :ends_at
  end
end
