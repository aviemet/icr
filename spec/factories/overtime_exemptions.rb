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
FactoryBot.define do
  factory :overtime_exemption do
    name { "Overtime Exemption" }
    active { true }
    criteria { [] }
  end
end
