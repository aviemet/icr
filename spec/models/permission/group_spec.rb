# == Schema Information
#
# Table name: permission_groups
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string
#  permissions :jsonb
#  precedence  :integer
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_permission_groups_on_name  (name) UNIQUE
#  index_permission_groups_on_slug  (slug) UNIQUE
#
require "rails_helper"

RSpec.describe Permission::Group, type: :model do
  include ActiveSupport::Testing::TimeHelpers

  subject(:group) { build(:permission_group) }

  describe "associations" do
    it { is_expected.to have_many(:assignments).dependent(:destroy) }
    it { is_expected.to have_many(:users).through(:assignments) }
    it { is_expected.to have_many(:job_titles).through(:assignments) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_uniqueness_of(:name) }
    it { is_expected.to validate_presence_of(:description) }
    it { is_expected.to validate_presence_of(:precedence) }
    it { is_expected.to validate_numericality_of(:precedence).only_integer }
  end

  describe "#permission?" do
    context "with matching allow permission" do
      subject(:group) { create(:permission_group, :with_allow_permission) }

      it "returns true when conditions match" do
        expect(group.permission?("clients", "view", {})).to be true
      end

      it "returns false for non-matching resource" do
        expect(group.permission?("employees", "view", {})).to be false
      end

      it "returns false for non-matching action" do
        expect(group.permission?("clients", "edit", {})).to be false
      end
    end

    context "with matching deny permission" do
      subject(:group) { create(:permission_group, :with_deny_permission) }

      it "returns false when conditions match" do
        expect(group.permission?("clients", "view", {})).to be false
      end
    end

    context "with owner_only condition" do
      subject(:group) do
        create(:permission_group, :with_allow_permission,
          conditions: { "owner_only" => true },)
      end

      it "returns true when user is owner" do
        expect(group.permission?("clients", "view", {
          user_id: 1,
          record_user_id: 1
        },)).to be true
      end

      it "returns false when user is not owner" do
        expect(group.permission?("clients", "view", {
          user_id: 1,
          record_user_id: 2
        },)).to be false
      end
    end

    context "with time_restricted condition" do
      it "evaluates time restrictions correctly" do
        now = Time.current.round
        start_time = (now - 1.hour).round
        end_time = (now + 1.hour).round

        group = create(:permission_group, :with_allow_permission,
          conditions: {
            "time_restricted" => {
              "start_time" => start_time.iso8601,
              "end_time" => end_time.iso8601
            }
          },)

        # Inside the window
        travel_to now do
          expect(group.permission?("clients", "view", {})).to be true
        end

        # Just before the window
        travel_to start_time - 1.second do
          expect(group.permission?("clients", "view", {})).to be false
        end

        # Just after the window
        travel_to end_time + 1.second do
          expect(group.permission?("clients", "view", {})).to be false
        end

        # Way outside the window
        travel_to end_time + 1.day do
          expect(group.permission?("clients", "view", {})).to be false
        end
      end
    end
  end

  describe "#explicit_deny?" do
    subject(:group) { create(:permission_group, :with_deny_permission) }

    it "returns true for matching deny permission" do
      expect(group.explicit_deny?("clients", "view", {})).to be true
    end

    it "returns false for non-matching resource" do
      expect(group.explicit_deny?("employees", "view", {})).to be false
    end
  end

  describe "#explicit_allow?" do
    subject(:group) { create(:permission_group, :with_allow_permission) }

    it "returns true for matching allow permission" do
      expect(group.explicit_allow?("clients", "view", {})).to be true
    end

    it "returns false for non-matching resource" do
      expect(group.explicit_allow?("employees", "view", {})).to be false
    end
  end
end
