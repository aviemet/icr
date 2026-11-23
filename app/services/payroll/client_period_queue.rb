# frozen_string_literal: true

module Payroll
  class ClientPeriodQueue
    def self.call(period:, client_ids:)
      new(period: period, client_ids: client_ids).call
    end

    def self.shifts_for_client(period:, client_id:)
      new(period: period, client_ids: [client_id]).shifts_for(client_id)
    end

    def initialize(period:, client_ids:)
      @period = period
      @client_ids = Array(client_ids)
    end

    def call
      page_clients = Client.where(id: @client_ids).includes_associated.order(:id)
      counts = shift_counts_by_client
      client_rows = page_clients.map { |client| client.render(:persisted) }
      client_id_keys = client_rows.map { |row| row[:id].to_s }

      {
        period_clients: client_rows,
        pending_shift_count_by_client: counts_for_clients(counts, client_id_keys, :pending),
        reviewed_shift_count_by_client: counts_for_clients(counts, client_id_keys, :reviewed),
        total_shift_count_by_client: counts_for_clients(counts, client_id_keys, :total),
      }
    end

    def shifts_for(client_id)
      @period.shift_occurrences(base_shifts_for(client_id))
    end

    private

    def base_shifts_for(client_id)
      shift_ids = shifts_in_period
        .joins(calendar_event: :event_participants)
        .where(
          event_participants: {
            participant_type: "Client",
            participant_id: client_id,
          },
        )
        .distinct
        .pluck(:id)

      Shift.where(id: shift_ids)
        .includes(
          :service_type,
          :employee,
          calendar_event: [
            :recurring_patterns,
            :event_exceptions,
            { clients: :person },
          ],
        )
        .to_a
    end

    def shifts_in_period
      PayPeriod.shifts_overlapping_period(@period).assigned
    end

    def shift_counts_by_client
      return {} if @client_ids.empty?

      shifts = shifts_in_period
        .joins(calendar_event: :event_participants)
        .where(
          event_participants: {
            participant_type: "Client",
            participant_id: @client_ids,
          },
        )
        .includes(calendar_event: [:recurring_patterns, :event_exceptions, :clients])
        .distinct
        .to_a
      scoped_client_ids = @client_ids.to_set(&:to_s)

      @period.shift_occurrences(shifts).each_with_object({}) do |occurrence, hash|
        occurrence.calendar_event.clients.each do |client|
          client_id = client.id.to_s
          next unless scoped_client_ids.include?(client_id)

          entry = hash[client_id] ||= { total: 0, reviewed: 0, pending: 0 }
          entry[:total] += 1
          if occurrence.facilitator_approved?
            entry[:reviewed] += 1
          else
            entry[:pending] += 1
          end
        end
      end
    end

    def counts_for_clients(counts, client_id_keys, field)
      client_id_keys.index_with { |client_id| counts.dig(client_id, field).to_i }
    end
  end
end
