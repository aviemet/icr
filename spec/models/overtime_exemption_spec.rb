# == Schema Information
#
# Table name: overtime_exemptions
#
#  id         :uuid             not null, primary key
#  active     :boolean          default(TRUE), not null
#  criteria   :jsonb            not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "rails_helper"

RSpec.describe OvertimeExemption, type: :model do
  describe "validations" do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:criteria) }
  end

  describe "#matches?" do
    let(:overnight_exemption) do
      described_class.create!(
        name: "Overnight Sleep Shift",
        criteria: [{
          "category" => { "operator" => "equals", "value" => "sleep_shift" },
          "start_time" => { "operator" => "between", "value" => ["22:00", "06:00"] },
          "duration" => { "operator" => "greater_than_equal", "value" => 8 }
        }],
      )
    end

    let(:daytime_exemption) do
      described_class.create!(
        name: "Day Shift",
        criteria: [{
          "category" => { "operator" => "equals", "value" => "regular" },
          "start_time" => { "operator" => "between", "value" => ["09:00", "17:00"] }
        }],
      )
    end

    context "with overnight shifts" do
      it "matches shift starting before midnight" do
        shift = build_shift(
          category: "sleep_shift",
          start_time: "22:30",
          end_time: "06:30",
          duration_hours: 8,
        )
        expect(overnight_exemption.matches?(shift)).to be true
      end

      it "matches shift starting after midnight" do
        shift = build_shift(
          category: "sleep_shift",
          start_time: "00:30",
          end_time: "08:30",
          duration_hours: 8,
        )
        expect(overnight_exemption.matches?(shift)).to be true
      end

      it "does not match shift with wrong duration" do
        shift = build_shift(
          category: "sleep_shift",
          start_time: "22:30",
          end_time: "05:30",
          duration_hours: 7,
        )
        expect(overnight_exemption.matches?(shift)).to be false
      end

      it "does not match shift outside overnight hours" do
        shift = build_shift(
          category: "sleep_shift",
          start_time: "20:00",
          end_time: "04:00",
          duration_hours: 8,
        )
        expect(overnight_exemption.matches?(shift)).to be false
      end
    end

    context "with daytime shifts" do
      it "matches shift within daytime hours" do
        shift = build_shift(
          category: "regular",
          start_time: "09:30",
          end_time: "17:30",
          duration_hours: 8,
        )
        expect(daytime_exemption.matches?(shift)).to be true
      end

      it "does not match shift crossing into evening" do
        shift = build_shift(
          category: "regular",
          start_time: "13:00",
          end_time: "21:00",
          duration_hours: 8,
        )
        expect(daytime_exemption.matches?(shift)).to be false
      end
    end

    context "with multiple criteria groups" do
      let(:complex_exemption) do
        described_class.create!(
          name: "Complex Rules",
          criteria: [
            {
              # Group 1: Overnight sleep shift
              "category" => { "operator" => "equals", "value" => "sleep_shift" },
              "start_time" => { "operator" => "between", "value" => ["22:00", "06:00"] }
            },
            {
              # Group 2: Long standby shift
              "category" => { "operator" => "equals", "value" => "standby" },
              "duration" => { "operator" => "greater_than_equal", "value" => 12 }
            }
          ],
        )
      end

      it "matches when any criteria group is satisfied (overnight)" do
        shift = build_shift(
          category: "sleep_shift",
          start_time: "23:00",
          end_time: "07:00",
          duration_hours: 8,
        )
        expect(complex_exemption.matches?(shift)).to be true
      end

      it "matches when any criteria group is satisfied (long standby)" do
        shift = build_shift(
          category: "standby",
          start_time: "08:00",
          end_time: "20:00",
          duration_hours: 12,
        )
        expect(complex_exemption.matches?(shift)).to be true
      end

      it "does not match when no criteria group is fully satisfied" do
        shift = build_shift(
          category: "standby",
          start_time: "09:00",
          end_time: "17:00",
          duration_hours: 8,
        )
        expect(complex_exemption.matches?(shift)).to be false
      end
    end
  end

  private

  def build_shift(attributes)
    start_time = Time.zone.parse(attributes[:start_time])
    end_time = Time.zone.parse(attributes[:end_time])

    instance_double(
      Shift,
      category: attributes[:category],
      start_time: start_time,
      end_time: end_time,
      duration_hours: attributes[:duration_hours],
    )
  end
end
