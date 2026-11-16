# == Schema Information
#
# Table name: companies
#
#  id         :uuid             not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Company < ApplicationRecord
  include Contactable

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
