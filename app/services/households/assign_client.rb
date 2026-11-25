module Households
  class AssignClient
    def self.call(household:, client:, starts_at: Date.current)
      new(household:, client:, starts_at:).call
    end

    def initialize(household:, client:, starts_at: Date.current)
      @household = household
      @client = client
      @starts_at = starts_at
    end

    def call
      membership = household.households_clients.build(
        client: client,
        starts_at: starts_at,
      )

      membership.save
      membership
    end

    private

    attr_reader :household, :client, :starts_at
  end
end
