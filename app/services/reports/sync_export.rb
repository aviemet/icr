# frozen_string_literal: true

module Reports
  class SyncExport
    def self.call(definition_slug:, user:, params: {})
      new(definition_slug: definition_slug, user: user, params: params).call
    end

    def initialize(definition_slug:, user:, params: {})
      @definition_slug = definition_slug
      @user = user
      @params = params
    end

    def call
      definition = Reports::SystemDefinitions.ensure!(@definition_slug)
      Reports::Enqueue.call(
        definition: definition,
        user: @user,
        params: @params,
        perform_now: true,
      )
    end
  end
end
