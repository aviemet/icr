# frozen_string_literal: true

module TimeOff
  class ApproveRequest
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

      ActiveRecord::Base.transaction do
        shift_starts = @request.starts_at
        shift_ends = shift_starts + @request.hours.to_f.hours
        shift = CreateLeaveShift.call(
          employee: @request.employee,
          service_type_slug: @request.service_type_slug,
          starts_at: shift_starts,
          ends_at: shift_ends,
          name: "#{@request.kind.upcase} leave",
        )

        @request.update!(
          status: :approved,
          reviewed_at: Time.current,
          review_note: @review_note,
          ends_at: shift_ends,
          shift: shift,
        )
      end

      @request
    end
  end
end
