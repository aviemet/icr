# == Schema Information
#
# Table name: companies
#
#  id         :uuid             not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class CompanySerializer < ApplicationSerializer
  attributes(
    :name,
  )
end
