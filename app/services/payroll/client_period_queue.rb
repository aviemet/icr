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
        .includes(:category, :employee, calendar_event: { clients: :person })
        .joins(:calendar_event)
        .order("calendar_events.starts_at")
        .to_a
    end

    private

    def shifts_in_period
      PayPeriod.shifts_overlapping_period(@period).assigned
    end

    def shift_counts_by_client
      return {} if @client_ids.empty?

      rows = shifts_in_period
        .joins(calendar_event: :event_participants)
        .where(
          event_participants: {
            participant_type: "Client",
            participant_id: @client_ids,
          },
        )
        .group("event_participants.participant_id")
        .pluck(
          Arel.sql("event_participants.participant_id"),
          Arel.sql("COUNT(DISTINCT shifts.id)"),
          Arel.sql("COUNT(DISTINCT shifts.id) FILTER (WHERE shifts.facilitator_approved_at IS NOT NULL)"),
        )

      rows.each_with_object({}) do |(client_id, total, reviewed), hash|
        hash[client_id.to_s] = {
          total: total.to_i,
          reviewed: reviewed.to_i,
          pending: total.to_i - reviewed.to_i,
        }
      end
    end

    def counts_for_clients(counts, client_id_keys, field)
      client_id_keys.index_with { |client_id| counts.dig(client_id, field).to_i }
    end
  end
end
