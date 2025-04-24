require "rails_helper"

RSpec.describe ApplicationPolicy do
  let(:user) { create(:user) }
  let(:person) { create(:person, user: user) }
  let(:record) { create(:client, person: create(:person)) }
  let(:policy) { described_class.new(user, record) }

  describe "standard authorization" do
    context "when user is an admin" do
      before { user.add_role(:admin) }

      it "allows all actions" do
        expect(policy.index?).to be true
        expect(policy.show?).to be true
        expect(policy.create?).to be true
        expect(policy.update?).to be true
        expect(policy.destroy?).to be true
      end
    end

    context "when user has explicit permissions" do
      let(:permission_group) do
        create(:permission_group, :with_allow_permission,
          resource: "clients",
          action: "show",)
      end

      before do
        person # ensure person is created
        create(:permission_assignment,
          permissionable: user,
          group: permission_group,
          starts_at: Time.current,)
      end

      it "allows permitted actions" do
        expect(policy.show?).to be true
      end

      it "denies non-permitted actions" do
        expect(policy.index?).to be false
        expect(policy.create?).to be false
        expect(policy.update?).to be false
        expect(policy.destroy?).to be false
      end
    end

    context "with owner-only permissions" do
      let(:owned_record) { create(:client, person: person) }
      let(:policy) { described_class.new(user, owned_record) }
      let(:permission_group) do
        create(:permission_group, :with_allow_permission,
          resource: "clients",
          action: "show",
          conditions: { "owner_only" => true },)
      end

      before do
        person # ensure person is created
        create(:permission_assignment,
          permissionable: user,
          group: permission_group,
          starts_at: Time.current,)
      end

      it "allows actions on owned records" do
        expect(policy.show?).to be true
      end

      it "denies actions on non-owned records" do
        other_record = create(:client, person: create(:person))
        other_policy = described_class.new(user, other_record)
        expect(other_policy.show?).to be false
      end
    end

    context "with time-restricted permissions" do
      let(:base_time) { Time.current }

      before do
        travel_to(base_time) do
          person # ensure person is created
          @permission_group = create(:permission_group, :with_allow_permission,
            resource: "clients",
            action: "show",
            conditions: {
              "time_restricted" => {
                "start_time" => 1.day.ago.iso8601,
                "end_time" => 1.day.from_now.iso8601
              }
            },)

          create(:permission_assignment,
            permissionable: user,
            group: @permission_group,
            starts_at: Time.current,)
        end
      end

      it "allows actions within the time window" do
        travel_to(base_time) do
          expect(policy.show?).to be true
        end
      end

      it "denies actions outside the time window" do
        travel_to(base_time + 2.days) do
          expect(policy.show?).to be false
        end
      end
    end
  end
end
