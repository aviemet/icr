# == Schema Information
#
# Table name: service_types
#
#  id                  :uuid             not null, primary key
#  active              :boolean          default(TRUE), not null
#  allows_multi_client :boolean          default(FALSE), not null
#  billable            :boolean          default(TRUE), not null
#  color               :string           default("#2F6FED"), not null
#  name                :string           not null
#  payable             :boolean          default(TRUE), not null
#  position            :integer          default(0), not null
#  requires_notes      :boolean          default(FALSE), not null
#  slug                :string           not null
#  system              :boolean          default(FALSE), not null
#  tracks_mileage      :boolean          default(FALSE), not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_service_types_on_active    (active)
#  index_service_types_on_name      (name) UNIQUE
#  index_service_types_on_position  (position)
#  index_service_types_on_slug      (slug) UNIQUE
#
class ServiceTypeSerializer < ApplicationSerializer
  object_as :service_type

  attributes(
    :name,
    :slug,
    :active,
    :system,
    :position,
    :billable,
    :payable,
    :allows_multi_client,
    :requires_notes,
    :tracks_mileage,
    :color,
  )
end
