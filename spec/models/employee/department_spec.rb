require "rails_helper"

# == Schema Information
#
# Table name: departments
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string           not null
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_departments_on_slug  (slug) UNIQUE
#
RSpec.describe Employee::Department, type: :model do
  it "is valid with a name" do
    expect(build(:department)).to be_valid
  end

  it "requires a name" do
    expect(build(:department, name: nil)).not_to be_valid
  end

  describe "job title dependency" do
    it "nullifies job titles when destroyed" do
      department = create(:department)
      job_title = create(:job_title, department: department)

      department.destroy!

      expect(job_title.reload.department_id).to be_nil
      expect(Employee::JobTitle.exists?(job_title.id)).to be(true)
    end
  end
end
