# == Schema Information
#
# Table name: clients
#
#  id                    :uuid             not null, primary key
#  active_at             :date
#  color                 :string
#  communication_notes   :text
#  ihss_authorized_hours :decimal(8, 2)
#  ihss_notes            :text
#  ihss_share_of_cost    :decimal(10, 2)
#  inactive_at           :date
#  ipp_ends_on           :date
#  ipp_review_on         :date
#  ipp_starts_on         :date
#  medi_cal_number       :string
#  number                :string
#  preferred_hospital    :string
#  preferred_language    :string
#  referred_by_other     :string
#  slug                  :string           not null
#  uci_number            :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  person_id             :uuid             not null
#  regional_center_id    :uuid
#
# Indexes
#
#  index_clients_on_person_id           (person_id)
#  index_clients_on_regional_center_id  (regional_center_id)
#  index_clients_on_slug                (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (regional_center_id => regional_centers.id)
#
class ClientSerializer < ApplicationSerializer
  include PersonFields
  include ColorMappingFields

  identifier :slug

  attributes(
    :person_id,
    :number,
    :active_at,
    :inactive_at,
    :color,
    :uci_number,
    :regional_center_id,
    :referred_by_other,
    :medi_cal_number,
    :ipp_starts_on,
    :ipp_ends_on,
    :ipp_review_on,
    :preferred_hospital,
    :preferred_language,
    :communication_notes,
    :ihss_authorized_hours,
    :ihss_share_of_cost,
    :ihss_notes,
  )

  belongs_to :person, serializer: PersonSerializer
  belongs_to :regional_center, serializer: RegionalCenters::OptionsSerializer, optional: true

  type :string, optional: true
  delegate :referral_label, to: :@object
end
