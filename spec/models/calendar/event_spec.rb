# == Schema Information
#
# Table name: calendar_events
#
#  id          :uuid             not null, primary key
#  all_day     :boolean          default(FALSE), not null
#  ends_at     :datetime
#  name        :string
#  notes       :text
#  starts_at   :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#  parent_id   :uuid
#
# Indexes
#
#  index_calendar_events_on_category_id  (category_id)
#  index_calendar_events_on_parent_id    (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (parent_id => calendar_events.id)
#
require "rails_helper"

RSpec.describe Calendar::Event do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:calendar_event)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(starts_at ends_at name).each do |attr|
        expect(build(:calendar_event, { attr => nil })).not_to be_valid
      end
    end

    it "is invalid if starts_at is before ends_at" do
      expect(build(:calendar_event, {
        starts_at: Time.zone.now,
        ends_at: 1.hour.ago,
      })).not_to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:parent).optional }

    it { is_expected.to have_many(:children).dependent(:destroy) }
    it { is_expected.to have_many(:event_exceptions).dependent(:destroy) }
    it { is_expected.to have_many(:clients).through(:event_participants) }
    it { is_expected.to have_many(:households).through(:event_participants) }
  end

  describe "series destroy" do
    it "destroys children when the master is destroyed" do
      master = create(:calendar_event)
      child = create(:calendar_event, parent: master)

      expect { master.destroy }.to change(described_class, :count).by(-2)
      expect(described_class.exists?(child.id)).to be(false)
    end

    it "leaves the master when a child is destroyed" do
      master = create(:calendar_event)
      child = create(:calendar_event, parent: master)

      expect { child.destroy }.to change(described_class, :count).by(-1)
      expect(described_class.exists?(master.id)).to be(true)
    end
  end

  describe "destroy" do
    it "destroys the linked shift when the period is open" do
      employee = create(:employee)
      shift = create(:shift, employee: employee)
      event = described_class.find(shift.calendar_event_id)

      expect { event.destroy }.to change(Shift, :count).by(-1)
      expect(described_class.exists?(event.id)).to be(false)
    end

    it "does not destroy when the pay period is finalized" do
      employee = create(:employee)
      shift = create(:shift, employee: employee)
      event = described_class.find(shift.calendar_event_id)
      shift.timesheet.pay_period.update!(finalized_at: Time.current)

      expect(event.destroy).to be(false)
      expect(event.errors[:base]).to include(I18n.t("pay_periods.finalized_locked"))
      expect(described_class.exists?(event.id)).to be(true)
      expect(Shift.exists?(shift.id)).to be(true)
    end
  end

  describe "pay period mutation lock" do
    around do |example|
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
      example.run
    end

    it "rejects create when the containing pay period is finalized" do
      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        employee = create(:employee)
        period_start = Date.new(2024, 3, 16)
        period_end = Date.new(2024, 3, 31)
        pay_period = PayPeriod.for_period_dates(period_start, period_end)
        pay_period.update!(finalized_at: Time.current)
        shift_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
          category.system = true
        }

        event = described_class.new(
          starts_at: Time.zone.local(2024, 3, 20, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 20, 17, 0, 0),
          category_id: shift_category.id,
        )
        event.build_shift(employee_id: employee.id)

        expect(event.save).to be(false)
        expect(event.errors[:base]).to include(I18n.t("pay_periods.finalized_locked"))
      end
    end

    it "rejects update when the linked pay period is finalized" do
      employee = create(:employee)
      shift = create(:shift, employee: employee)
      event = described_class.find(shift.calendar_event_id)
      shift.timesheet.pay_period.update!(finalized_at: Time.current)

      expect(event.update(starts_at: event.starts_at + 1.hour)).to be(false)
      expect(event.errors[:base]).to include(I18n.t("pay_periods.finalized_locked"))
    end

    it "allows updating a recurring master whose timesheet period is finalized when the series reaches an open period" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee)
        past_start = Date.new(2024, 2, 16)
        past_end = Date.new(2024, 2, 29)
        past_period = PayPeriod.for_period_dates(past_start, past_end)
        past_period.update!(finalized_at: Time.current)

        open_start = Date.new(2024, 3, 16)
        open_end = Date.new(2024, 3, 31)
        PayPeriod.for_period_dates(open_start, open_end)

        master_starts = Time.zone.local(2024, 2, 19, 9, 0, 0)
        shift = create(
          :shift,
          employee: employee,
          calendar_event: create(
            :calendar_event,
            starts_at: master_starts,
            ends_at: master_starts + 8.hours,
          ),
        )
        event = described_class.find(shift.calendar_event_id)
        create(
          :calendar_recurring_pattern,
          calendar_event: event,
          recurring_type: :weekly,
          day_of_week: 1,
          end_date: nil,
        )
        shift.update_column(:timesheet_id, past_period.timesheets.find_or_create_by!(employee_id: employee.id).id) # rubocop:disable Rails/SkipsModelValidations

        expect(event.update(notes: "series still open")).to be(true)
      end
    end
  end

  describe ".for_schedule_range" do
    it "includes a recurring master that started before the visible range" do
      shift_category = Category.type("Calendar::Event").find_or_create_by!(name: "Other") { |category| category.system = true }
      master = create(
        :calendar_event,
        category_id: shift_category.id,
        starts_at: Time.zone.parse("2026-11-16 09:00"),
        ends_at: Time.zone.parse("2026-11-16 17:00"),
      )
      create(
        :calendar_recurring_pattern,
        calendar_event: master,
        recurring_type: :weekly,
        day_of_week: 1,
        end_date: nil,
      )

      range_start = Time.zone.parse("2026-12-01 00:00")
      range_end = Time.zone.parse("2026-12-31 23:59")

      expect(described_class.for_schedule_range(range_start, range_end)).to include(master)
    end

    it "excludes non-recurring events outside the range" do
      event = create(
        :calendar_event,
        starts_at: Time.zone.parse("2026-10-01 09:00"),
        ends_at: Time.zone.parse("2026-10-01 17:00"),
      )

      range_start = Time.zone.parse("2026-12-01 00:00")
      range_end = Time.zone.parse("2026-12-31 23:59")

      expect(described_class.for_schedule_range(range_start, range_end)).not_to include(event)
    end
  end

  describe "Scopes" do
    # Create the events only before running the scope tests
    before do
      @event1 = create(:calendar_event, {
        starts_at: 1.day.ago,
        ends_at: 1.hour.ago
      })
      @event2 = create(:calendar_event, {
        starts_at: 3.days.ago,
        ends_at: 2.days.ago
      })
      @event3 = create(:calendar_event, {
        starts_at: 7.days.ago,
        ends_at: 6.days.ago
      })
      @event4 = create(:calendar_event, {
        starts_at: 1.hour.from_now,
        ends_at: 2.hours.from_now
      })
      @event5 = create(:calendar_event, {
        starts_at: 2.days.from_now,
        ends_at: 3.days.from_now
      })
      @event6 = create(:calendar_event, {
        starts_at: 1.week.from_now,
        ends_at: 1.week.from_now + 1.day
      })
    end

    describe ".before" do
      it "fetches events which start before the given time" do
        time = 2.days.ago
        events = described_class.before(time)

        expect(events).to include(@event2, @event3)
        expect(events).not_to include(@event1, @event4, @event5, @event6)
      end
    end

    describe ".after" do
      it "returns events end after the given time" do
        time = 1.day.from_now
        events = described_class.after(time)

        expect(events).to include(@event5, @event6)
        expect(events).not_to include(@event1, @event2, @event3, @event4)
      end
    end

    describe ".between" do
      it "returns events which occur within the given time range" do
        start_time = 1.day.ago + 1.hour
        end_time = 1.week.from_now - 1.hour
        events = described_class.between(start_time, end_time)

        expect(events).to include(@event1, @event4, @event5)
        expect(events).not_to include(@event2, @event3, @event6)
      end
    end

  end

  describe "#occurrences_in" do
    it "expands a recurring master into range occurrences" do
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 4, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 4, 17, 0, 0),
      )
      event.recurring_patterns.create!(
        recurring_type: :weekly,
        offset: 1,
        day_of_week: 1,
        end_date: Date.new(2024, 3, 31),
      )

      rows = event.occurrences_in(
        Time.zone.local(2024, 3, 16).beginning_of_day,
        Time.zone.local(2024, 3, 31).end_of_day,
      )

      expect(rows.map { |row| row.starts_at.to_date }).to eq([
        Date.new(2024, 3, 18),
        Date.new(2024, 3, 25),
      ])
      expect(rows.map(&:recurring).uniq).to eq([true])
    end
  end

  describe ".schedule_occurrences_in" do
    it "returns schedule wrappers with occurrence display times" do
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 4, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 4, 17, 0, 0),
      )
      event.recurring_patterns.create!(
        recurring_type: :weekly,
        offset: 1,
        day_of_week: 1,
        end_date: Date.new(2024, 3, 31),
      )

      rows = described_class.schedule_occurrences_in(
        [event],
        range_start: Time.zone.local(2024, 3, 16).beginning_of_day,
        range_end: Time.zone.local(2024, 3, 31).end_of_day,
      )

      expect(rows).to all(be_a(Calendar::ScheduleOccurrence))
      expect(rows.map(&:starts_at).map(&:to_date)).to eq([
        Date.new(2024, 3, 18),
        Date.new(2024, 3, 25),
      ])
      expect(rows.map(&:master_id).uniq).to eq([event.id])
    end
  end
end
