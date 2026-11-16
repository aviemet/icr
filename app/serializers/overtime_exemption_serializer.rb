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
class OvertimeExemptionSerializer < ApplicationSerializer
  include Persisted

  object_as :overtime_exemption

  attributes(
    :name,
    :active,
    criteria: { type: "OvertimeExemptionCriteria" },

  )
end
