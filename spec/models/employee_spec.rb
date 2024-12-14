# == Schema Information
#
# Table name: employees
#
#  id          :uuid             not null, primary key
#  active_at   :date
#  color       :string
#  inactive_at :date
#  number      :string
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :uuid             not null
#
# Indexes
#
#  index_employees_on_person_id  (person_id)
#  index_employees_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
require 'rails_helper'

RSpec.describe Employee do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:employee)).to be_valid
    end

    it 'is invlalid with missing attributes' do
      %i().each do |attr|
        expect(build(:employee, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to belong_to(:person) }

    it{ is_expected.to have_many(:job_titles).through(:employees_job_titles) }
    it{ is_expected.to have_many(:pay_rates) }

    it{ is_expected.to have_one(:active_employees_job_title) }
    it{ is_expected.to have_one(:job_title).through(:active_employees_job_title) }
  end
end
