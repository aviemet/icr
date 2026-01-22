require "rails_helper"

RSpec.describe CalendarCustomizable do
  shared_examples "a calendar customizable entity" do
    let(:customizable) { described_class.name.underscore.to_sym }

    describe "#color_mappings" do
      it "returns an empty hash when no customization exists" do
        expect(build(customizable).color_mappings).to eq({})
      end

      it "returns the color mappings from the associated customization" do
        record = build(customizable)
        record.set_color("employees", 1, "#FF0000")
        expect(record.color_mappings).to eq({ "employees" => { "1" => "#FF0000" } })
      end
    end

    describe "#set_color" do
      it "creates a new customization if none exists" do
        record = create(customizable)
        expect {
          record.set_color("employees", 1, "#00FF00")
        }.to change(Calendar::Customization, :count).by(1)

        expect(record.color_for("employees", 1)).to eq("#00FF00")
      end

      it "updates the color for an existing entity type and ID" do
        record = build(customizable)
        record.set_color("employees", 1, "#00FF00")
        record.set_color("employees", 1, "#FF0000")

        expect(record.color_for("employees", 1)).to eq("#FF0000")
      end
    end

    describe "#color_for" do
      it "retrieves the color for a given entity type and ID" do
        record = build(customizable)
        record.set_color("employees", 1, "#123456")
        expect(record.color_for("employees", 1)).to eq("#123456")
      end

      it "returns nil if no color mapping exists for the given entity and ID" do
        expect(build(customizable).color_for("employees", 2)).to be_nil
      end
    end

    describe "#remove_color" do
      it "removes the color mapping for a specific entity and ID" do
        record = create(customizable)
        record.set_color("employees", 1, "#FF0000")
        expect(record.color_for("employees", 1)).to eq("#FF0000")

        record.remove_color("employees", 1)
        expect(record.color_for("employees", 1)).to be_nil
      end

      it "does nothing if no customization exists" do
        record = create(customizable)
        expect {
          record.remove_color("employees", 1)
        }.not_to change(Calendar::Customization, :count)
      end
    end
  end

  describe Client do
    it_behaves_like "a calendar customizable entity"
  end

  describe Employee do
    it_behaves_like "a calendar customizable entity"
  end
end
