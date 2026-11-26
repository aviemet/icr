# frozen_string_literal: true

module TimeOff
  class DenyRequest
    class Error < StandardError; end

    def self.call(request:, review_note: nil)
      new(request: request, review_note: review_note).call
    end

    def initialize(request:, review_note:)
      @request = request
      @review_note = review_note
    end

    def call
      raise Error, "request is not pending" unless @request.pending?

      @request.update!(
        status: :denied,
        reviewed_at: Time.current,
        review_note: @review_note,
      )
      @request
    end
  end
end
