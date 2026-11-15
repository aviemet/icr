require "rails_helper"

RSpec.describe Dev::SeedShifts do
  describe ".call" do
    it "refuses to run outside development" do
      expect { described_class.call }.to raise_error(described_class::EnvironmentError, /development/)
    end

    context "when the environment is development" do
      let(:start_date) { Date.new(2026, 11, 9) }
      let(:end_date) { Date.new(2026, 11, 13) }

      before do
        allow(Rails.env).to receive(:development?).and_return(true)
        Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
        Setting.payroll_period_day = "monday"
        Setting.overtime_daily_hours = 8
        Setting.overtime_weekly_hours = 40
      end

      it "raises when there are no clients or employees" do
        expect { described_class.call }.to raise_error(ArgumentError, /client and one employee/)
      end

      it "creates weekday shifts for existing clients and fills timesheet hour columns" do
        clients = create_list(:client, 2)
        employees = create_list(:employee, 2)
        weekday_count = (start_date..end_date).count { |date| !date.saturday? && !date.sunday? }

        result = described_class.call(start_date:, end_date:, random: Random.new(1))

        expect(result.shifts_created).to eq(clients.size * weekday_count)
        expect(result.timesheets_updated).to be > 0
        expect(Shift.count).to eq(clients.size * weekday_count)

        clients.each do |client|
          expect(client.calendar_events.count).to eq(weekday_count)
          expect(client.calendar_events).to all(have_attributes(name: nil))
        end

        Shift.includes(:calendar_event).group_by(&:employee_id).each_value do |shifts|
          shifts.sort_by(&:starts_at).each_cons(2) do |earlier, later|
            expect(earlier.ends_at).to be <= later.starts_at
          end
        end

        timesheets = Timesheet.all
        expect(timesheets).not_to be_empty
        timesheets.each do |timesheet|
          expect(timesheet.total_regular_hours).not_to be_nil
          expect(timesheet.total_ot_hours).not_to be_nil
          expect(timesheet.total_sick_hours).to eq(0)
          expect(timesheet.total_pto_hours).to eq(0)
        end

        recorded_hours = timesheets.sum { |timesheet| timesheet.total_regular_hours.to_f + timesheet.total_ot_hours.to_f }
        scheduled_hours = Shift.all.sum(&:duration_hours)
        expect(recorded_hours).to be_within(0.05).of(scheduled_hours)

        expect(Shift.includes(:category).map { |shift| shift.category.name }).to all(eq("Regular"))
        expect(employees.map(&:id)).to include(*Shift.distinct.pluck(:employee_id))
      end

      it "does not add a second shift on a client day that already has one" do
        create_list(:client, 2)
        create_list(:employee, 2)
        described_class.call(start_date:, end_date:, random: Random.new(1))

        second = described_class.call(start_date:, end_date:, random: Random.new(2))

        expect(second.shifts_created).to eq(0)
        expect(second.timesheets_updated).to eq(0)
      end
    end
  end
end
