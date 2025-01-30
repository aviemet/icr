# == Schema Information
#
# Table name: settings
#
#  id         :bigint           not null, primary key
#  value      :text
#  var        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_settings_on_var  (var) UNIQUE
#
require "rails_helper"

RSpec.describe Setting, type: :model do
  describe "fields" do
    describe "company_name" do
      it "has default value" do
        expect(described_class.company_name).to eq(Setting::DEFAULT_SETTINGS[:company_name])
      end

      it "requires presence" do
        expect { described_class.company_name = nil }
          .to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    describe "default_language" do
      it "has default value" do
        expect(described_class.default_language).to eq(Setting::DEFAULT_SETTINGS[:default_language])
      end

      it "requires presence" do
        expect { described_class.default_language = nil }
          .to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    describe "default_currency" do
      it "has default value" do
        expect(described_class.default_currency).to eq(Setting::DEFAULT_SETTINGS[:default_currency])
      end

      it "requires presence" do
        expect { described_class.default_currency = nil }
          .to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    describe "default_timezone" do
      it "has default value" do
        expect(described_class.default_timezone).to eq(Setting::DEFAULT_SETTINGS[:default_timezone])
      end

      it "requires presence" do
        expect { described_class.default_timezone = nil }
          .to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    describe "pay_period_type" do
      it "has default value" do
        expect(described_class.pay_period_type).to eq(Setting::DEFAULT_SETTINGS[:pay_period_type])
      end

      it "requires presence" do
        expect { described_class.pay_period_type = nil }
          .to raise_error(ActiveRecord::RecordInvalid)
      end

      it "only allows valid pay period types" do
        Setting::PAY_PERIOD_TYPES.each_value do |valid_type|
          expect { described_class.pay_period_type = valid_type }.not_to raise_error
        end

        expect { described_class.pay_period_type = "invalid_type" }
          .to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    describe "shift_title_format" do
      it "has default value" do
        expect(described_class.shift_title_format).to eq(Setting::DEFAULT_SETTINGS[:shift_title_format])
      end

      context "with valid formats" do
        [
          "{full_name} - {YYYY-MM-DD}",
          "Shift for {first_name}",
          "{last_name} - {MM/DD/YYYY HH:mm}",
          "Regular text without variables",
          "{YYYY}-{MM}-{DD} {first_name}"
        ].each do |valid_format|
          it "accepts '#{valid_format}'" do
            expect { described_class.shift_title_format = valid_format }.not_to raise_error
          end
        end
      end

      context "with invalid formats" do
        [
          "{invalid_var}",
          "{full_name} - {invalid_date}",
          "Unclosed brace {full_name",
          "Extra closing brace full_name}",
          "{{nested_braces}}",
          "{unknown_variable}"
        ].each do |invalid_format|
          it "rejects '#{invalid_format}'" do
            expect { described_class.shift_title_format = invalid_format }
              .to raise_error(ActiveRecord::RecordInvalid)
          end
        end
      end
    end
  end

  describe "constants" do
    describe "PAY_PERIOD_TYPES" do
      it "defines expected period types" do
        expect(Setting::PAY_PERIOD_TYPES).to eq({
          weekly: "weekly",
          bi_weekly: "bi_weekly",
          semi_monthly: "semi_monthly",
          monthly: "monthly"
        })
      end

      it "is frozen" do
        expect(Setting::PAY_PERIOD_TYPES).to be_frozen
      end
    end

    describe "ALLOWED_TEMPLATE_VARS" do
      it "defines expected template variables" do
        expect(Setting::ALLOWED_TEMPLATE_VARS).to eq([:first_name, :last_name, :full_name])
      end

      it "is frozen" do
        expect(Setting::ALLOWED_TEMPLATE_VARS).to be_frozen
      end
    end
  end
end
