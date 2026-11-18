# == Schema Information
#
# Table name: shift_templates
#
#  id         :uuid             not null, primary key
#  active     :boolean          default(TRUE), not null
#  end_date   :date
#  frequency  :integer
#  name       :string
#  start_date :date
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :uuid             not null
#
# Indexes
#
#  index_shift_templates_on_client_id  (client_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#
class ShiftTemplateSerializer < ApplicationSerializer
  object_as :shift_template

  attributes(
    :name,
    :start_date,
    :end_date,
    :frequency,
    :active,
    :client_id,
  )
end
