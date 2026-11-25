# == Schema Information
#
# Table name: companies
#
#  id                 :uuid             not null, primary key
#  name               :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  regional_center_id :uuid
#
# Indexes
#
#  index_companies_on_regional_center_id  (regional_center_id)
#
# Foreign Keys
#
#  fk_rails_...  (regional_center_id => regional_centers.id)
#
class CompanySerializer < ApplicationSerializer
  attributes(
    :name,
    :regional_center_id,
  )

  belongs_to :regional_center, serializer: RegionalCenters::OptionsSerializer, optional: true
end
