require "rails_helper"

RSpec.describe Households::RenderSchedule do
  it "includes former-member shifts inside the membership window and excludes those outside" do
    household = create(:household)
    client = create(:client)
    employee = create(:employee)
    create(
      :households_client,
      household: household,
      client: client,
      starts_at: Date.new(2026, 1, 1),
      ends_at: Date.new(2026, 1, 15),
    )

    inside_shift = create(:shift, employee: employee)
    inside_event = create(
      :calendar_event,
      shift: inside_shift,
      starts_at: Time.zone.local(2026, 1, 10, 9, 0, 0),
      ends_at: Time.zone.local(2026, 1, 10, 11, 0, 0),
    )
    create(:event_participant, calendar_event: inside_event, participant: client)

    outside_shift = create(:shift, employee: employee)
    outside_event = create(
      :calendar_event,
      shift: outside_shift,
      starts_at: Time.zone.local(2026, 1, 20, 9, 0, 0),
      ends_at: Time.zone.local(2026, 1, 20, 11, 0, 0),
    )
    create(:event_participant, calendar_event: outside_event, participant: client)

    payload = described_class.call(
      household: household,
      range_start: Time.zone.local(2026, 1, 1).beginning_of_day,
      range_end: Time.zone.local(2026, 1, 31).end_of_day,
    )
    ids = payload.pluck(:id)

    expect(ids).to include(inside_event.id)
    expect(ids).not_to include(outside_event.id)
  end

  it "includes current member shifts in range" do
    household = create(:household)
    client = create(:client)
    employee = create(:employee)
    create(:households_client, household: household, client: client, starts_at: Date.new(2026, 1, 1))

    shift = create(:shift, employee: employee)
    event = create(
      :calendar_event,
      shift: shift,
      starts_at: Time.zone.local(2026, 1, 12, 9, 0, 0),
      ends_at: Time.zone.local(2026, 1, 12, 11, 0, 0),
    )
    create(:event_participant, calendar_event: event, participant: client)

    payload = described_class.call(
      household: household,
      range_start: Time.zone.local(2026, 1, 1).beginning_of_day,
      range_end: Time.zone.local(2026, 1, 31).end_of_day,
    )

    expect(payload.pluck(:id)).to include(event.id)
  end
end
