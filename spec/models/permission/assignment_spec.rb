# == Schema Information
#
# Table name: permission_assignments
#
#  id                  :uuid             not null, primary key
#  conditions          :jsonb
#  ends_at             :datetime
#  permissionable_type :string           not null
#  starts_at           :datetime
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  permission_group_id :uuid             not null
#  permissionable_id   :uuid             not null
#
# Indexes
#
#  index_permission_assignments_on_permission_group_id  (permission_group_id)
#  index_permission_assignments_on_permissionable       (permissionable_type,permissionable_id)
#
# Foreign Keys
#
#  fk_rails_...  (permission_group_id => permission_groups.id)
#
require "rails_helper"

RSpec.describe Permission::Assignment, type: :model do
  subject(:assignment) { build(:permission_assignment) }

  describe "associations" do
    it { is_expected.to belong_to(:group).class_name("Permission::Group") }
    it { is_expected.to belong_to(:permissionable) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:starts_at) }

    it "validates uniqueness of permission_group_id scoped to permissionable" do
      original = create(:permission_assignment, :for_user)
      duplicate = build(:permission_assignment,
        group: original.group,
        permissionable: original.permissionable,)
      expect(duplicate).not_to be_valid
    end

    context "when ends_at is present" do
      it "validates ends_at is after starts_at" do
        assignment.starts_at = Time.current
        assignment.ends_at = 1.day.ago

        expect(assignment).not_to be_valid
        expect(assignment.errors[:ends_at]).to include("must be after starts_at")
      end
    end
  end

  describe "scopes" do
    describe ".current" do
      let!(:current_assignment) { create(:permission_assignment) }
      let!(:expired_assignment) { create(:permission_assignment, :expired) }
      let!(:future_assignment) { create(:permission_assignment, :future) }

      it "returns only current assignments" do
        expect(described_class.current).to include(current_assignment)
        expect(described_class.current).not_to include(expired_assignment)
        expect(described_class.current).not_to include(future_assignment)
      end
    end
  end
end
