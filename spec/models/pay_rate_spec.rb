# == Schema Information
#
# Table name: pay_rates
#
#  id            :uuid             not null, primary key
#  ends_at       :datetime
#  notes         :text
#  period        :integer          not null
#  rate_cents    :integer          default(0), not null
#  rate_currency :string           default("USD"), not null
#  starts_at     :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  employee_id   :uuid             not null
#
# Indexes
#
#  index_pay_rates_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
require "rails_helper"

RSpec.describe PayRate do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:pay_rate)).to be_valid
    end

    it "uses money-rails for the pay rate" do
      expect(build(:pay_rate)).to monetize(:rate_cents)
    end

    it "requires a positive value for pay rate" do
      expect(build(:pay_rate, { rate_cents: -10 })).not_to be_valid
    end

    it "is invlalid with missing attributes" do
      %i(period rate).each do |attr|
        expect(build(:pay_rate, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to belong_to(:employee) }
  end

  describe "Scopes" do
    describe "active" do
      it "only returns active pay rates" do
        employee = create(:employee)
        create(:pay_rate, :historical, { employee: })
        active = create(:pay_rate, :active, { employee: })

        expect(employee.pay_rates.active).to eq([active])
      end
    end

    describe "historical" do
      it "only returns historical pay rates" do
        employee = create(:employee)
        historical = create(:pay_rate, :historical, { employee: })
        create(:pay_rate, :active, { employee: })

        expect(employee.pay_rates.historical).to eq([historical])
      end
    end
  end
end
