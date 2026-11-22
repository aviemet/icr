# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::IhssHourClassifier do
  def interval(attrs)
    Payroll::WorkInterval.new(
      id: attrs[:id] || SecureRandom.uuid,
      employee_id: attrs[:employee_id],
      starts_at: attrs[:starts_at],
      ends_at: attrs[:ends_at],
      category: attrs[:category],
      ihss: attrs.fetch(:ihss, false),
      client_ids: attrs[:client_ids] || [],
    )
  end

  describe ".call" do
    it "marks intervals from the shift ihss flag in shift mode" do
      employee_id = SecureRandom.uuid
      flagged = interval(
        employee_id: employee_id,
        starts_at: Time.zone.local(2024, 3, 11, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 11, 17, 0, 0),
        ihss: true,
      )
      plain = interval(
        employee_id: employee_id,
        starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
        ihss: false,
      )
      pay_period = create(:pay_period, starts_at: Date.new(2024, 3, 11), ends_at: Date.new(2024, 3, 17))

      result = described_class.call(
        pay_period: pay_period,
        intervals: [flagged, plain],
        assignment_mode: "shift",
      )

      expect(result.map(&:ihss?)).to eq([true, false])
    end

    it "consumes period assignment hours chronologically against matching client intervals" do
      employee = create(:employee)
      client = create(:client)
      other_client = create(:client)
      pay_period = create(:pay_period, starts_at: Date.new(2024, 3, 11), ends_at: Date.new(2024, 3, 17))
      create(
        :ihss_period_assignment,
        pay_period: pay_period,
        employee: employee,
        client: client,
        hours: 6.0,
      )

      first = interval(
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 11, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 11, 17, 0, 0),
        client_ids: [client.id],
      )
      second = interval(
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
        client_ids: [other_client.id],
      )

      result = described_class.call(
        pay_period: pay_period,
        intervals: [first, second],
        assignment_mode: "period",
      )

      expect(result.size).to eq(3)
      expect(result[0].ihss?).to be(true)
      expect(result[0].duration_hours).to eq(6.0)
      expect(result[1].ihss?).to be(false)
      expect(result[1].duration_hours).to eq(2.0)
      expect(result[2].ihss?).to be(false)
      expect(result[2].duration_hours).to eq(8.0)
    end

    it "does not consume assignment hours for a different client" do
      employee = create(:employee)
      client_a = create(:client)
      client_b = create(:client)
      pay_period = create(:pay_period, starts_at: Date.new(2024, 3, 11), ends_at: Date.new(2024, 3, 17))
      create(
        :ihss_period_assignment,
        pay_period: pay_period,
        employee: employee,
        client: client_a,
        hours: 20.0,
      )

      only_b = interval(
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 11, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 11, 17, 0, 0),
        client_ids: [client_b.id],
      )

      result = described_class.call(
        pay_period: pay_period,
        intervals: [only_b],
        assignment_mode: "period",
      )

      expect(result.size).to eq(1)
      expect(result.first.ihss?).to be(false)
    end

    it "caps IHSS hours at available matching shift capacity" do
      employee = create(:employee)
      client = create(:client)
      pay_period = create(:pay_period, starts_at: Date.new(2024, 3, 11), ends_at: Date.new(2024, 3, 17))
      create(
        :ihss_period_assignment,
        pay_period: pay_period,
        employee: employee,
        client: client,
        hours: 40.0,
      )

      only = interval(
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 11, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 11, 13, 0, 0),
        client_ids: [client.id],
      )

      result = described_class.call(
        pay_period: pay_period,
        intervals: [only],
        assignment_mode: "period",
      )

      expect(result.size).to eq(1)
      expect(result.first.ihss?).to be(true)
      expect(result.first.duration_hours).to eq(4.0)
    end
  end
end
