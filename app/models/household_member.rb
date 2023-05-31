class HouseholdMember < ApplicationRecord
  belongs_to :household
  belongs_to :client, required: false
  belongs_to :employee, required: false
end
