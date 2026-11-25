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
class Company < ApplicationRecord
  include Contactable

  belongs_to :regional_center, optional: true

  validates :name, presence: true

  def self.instance
    first_or_create!(name: Setting.company_name.presence || "Company")
  end

  after_update :sync_company_name_setting, if: :saved_change_to_name?

  private

  def sync_company_name_setting
    Setting.company_name = name
  end
end
