# frozen_string_literal: true

require "rails_helper"

RSpec.describe Shifts::OpenVisibility do
  around do |example|
    travel_to(Time.zone.local(2026, 4, 13, 12, 0, 0)) { example.run }
  end

  def create_open_shift_for(client, starts_at:, ends_at: nil)
    ends_at ||= starts_at + 2.hours
    event = create(:calendar_event, starts_at: starts_at, ends_at: ends_at)
    create(:event_participant, calendar_event: event, participant: client)
    create(:shift, :open, calendar_event: event)
  end

  let(:client) { create(:client) }
  let(:other_client) { create(:client) }
  let(:admin) { create(:user).tap { |user| user.add_role(:admin) } }
  let(:facilitator_user) { create(:user) }
  let(:facilitator) { create(:employee, person: facilitator_user.person) }
  let(:attendant_user) { create(:user) }
  let(:attendant) { create(:employee, person: attendant_user.person) }

  before do
    create(:clients_manager, client: client, manager: facilitator)
  end

  describe "#can_view?" do
    it "allows admins for any client" do
      expect(described_class.can_view?(admin, client)).to be(true)
      expect(described_class.can_view?(admin, other_client)).to be(true)
    end

    it "allows the current manager for that client" do
      expect(described_class.can_view?(facilitator_user, client)).to be(true)
      expect(described_class.can_view?(facilitator_user, other_client)).to be(false)
    end

    it "denies attendants and clients" do
      client_user = create(:user)
      create(:client, person: client_user.person)

      expect(described_class.can_view?(attendant_user, client)).to be(false)
      expect(described_class.can_view?(client_user, client)).to be(false)
    end
  end

  describe "#future_open_shifts" do
    it "includes only future open shifts for admins" do
      future = create_open_shift_for(client, starts_at: 1.day.from_now)
      create_open_shift_for(client, starts_at: 1.day.ago)
      create(:shift, calendar_event: create(:calendar_event, starts_at: 2.days.from_now, ends_at: 2.days.from_now + 2.hours))

      ids = described_class.future_open_shifts_for(admin).pluck(:id)
      expect(ids).to eq([future.id])
    end

    it "scopes facilitators to managed clients only" do
      managed = create_open_shift_for(client, starts_at: 1.day.from_now)
      create_open_shift_for(other_client, starts_at: 2.days.from_now)

      ids = described_class.future_open_shifts_for(facilitator_user).pluck(:id)
      expect(ids).to eq([managed.id])
    end

    it "returns none for attendants" do
      create_open_shift_for(client, starts_at: 1.day.from_now)

      expect(described_class.future_open_shifts_for(attendant_user)).to be_empty
    end
  end

  describe "#future_open_count_for_client" do
    it "counts future open shifts when viewer is allowed" do
      create_open_shift_for(client, starts_at: 1.day.from_now)
      create_open_shift_for(client, starts_at: 2.days.from_now)
      create_open_shift_for(client, starts_at: 1.day.ago)

      expect(described_class.future_open_count_for_client(admin, client)).to eq(2)
      expect(described_class.future_open_count_for_client(facilitator_user, client)).to eq(2)
      expect(described_class.future_open_count_for_client(attendant_user, client)).to eq(0)
    end
  end
end
