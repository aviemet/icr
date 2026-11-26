# frozen_string_literal: true

module TimeOff
  class CancelRequest
    class Error < StandardError; end

    def self.call(request:)
      new(request: request).call
    end

    def initialize(request:)
      @request = request
    end

    def call
      raise Error, "request is not pending" unless @request.pending?

      @request.update!(status: :canceled)
      @request
    end
  end
end
