require "rails_helper"

RSpec.describe Permission::Resolver do
  subject(:resolver) { described_class.new(user) }

  let(:user) { create(:user) }
  let(:resource) { "clients" }
  let(:action) { "view" }
  let(:context) { { user_id: user.id } }

  describe "#can?" do
    context "when user is admin" do
      before { user.add_role(:admin) }

      it "returns true regardless of permissions" do
        expect(resolver.can?(resource, action, context)).to be true
      end
    end

    context "with multiple permission levels" do
      let(:high_precedence_group) { create(:permission_group, precedence: 100) }
      let(:medium_precedence_group) { create(:permission_group, precedence: 50) }
      let(:low_precedence_group) { create(:permission_group, precedence: 1) }

      context "when higher precedence denies" do
        before do
          create(:permission_assignment, :for_user,
            group: high_precedence_group.tap { |g|
              g.permissions_array = [{
                resource: resource,
                action: action,
                effect: "deny"
              }]
            },
            permissionable: user,)

          create(:permission_assignment, :for_user,
            group: low_precedence_group.tap { |g|
              g.permissions_array = [{
                resource: resource,
                action: action,
                effect: "allow"
              }]
            },
            permissionable: user,)
        end

        it "returns false despite lower precedence allow" do
          expect(resolver.can?(resource, action, context)).to be false
        end
      end

      context "when same precedence has both allow and deny" do
        let(:medium_precedence_deny_group) { create(:permission_group, precedence: 50) }
        let(:medium_precedence_allow_group) { create(:permission_group, precedence: 50) }

        before do
          create(:permission_assignment, :for_user,
            group: medium_precedence_deny_group.tap { |g|
              g.permissions_array = [{
                resource: resource,
                action: action,
                effect: "deny"
              }]
            },
            permissionable: user,)

          create(:permission_assignment, :for_user,
            group: medium_precedence_allow_group.tap { |g|
              g.permissions_array = [{
                resource: resource,
                action: action,
                effect: "allow"
              }]
            },
            permissionable: user,)
        end

        it "returns false as deny takes precedence at same level" do
          expect(resolver.can?(resource, action, context)).to be false
        end
      end

      context "with permissions from different sources" do
        let(:job_title) { create(:job_title) }
        let(:employee) { create(:employee) }
        let(:person) { create(:person, employee: employee) }
        let(:user_with_roles) { create(:user, person: person) }
        let(:resolver_with_roles) { described_class.new(user_with_roles) }

        before do
          # Save the employee and assign job title
          employee.save!
          employee.assign_job_title(job_title)

          # Job title permission (low precedence)
          create(:permission_assignment, :for_job_title,
            group: low_precedence_group.tap { |g|
              g.permissions_array = [{
                resource: resource,
                action: action,
                effect: "allow"
              }]
            },
            permissionable: job_title,)

          # Direct user permission (high precedence)
          create(:permission_assignment, :for_user,
            group: high_precedence_group.tap { |g|
              g.permissions_array = [{
                resource: resource,
                action: action,
                effect: "deny"
              }]
            },
            permissionable: user_with_roles,)
        end

        it "respects precedence across different sources" do
          expect(resolver_with_roles.can?(resource, action, context)).to be false
        end
      end
    end

    context "with no matching permissions" do
      it "returns false (implicit deny)" do
        expect(resolver.can?(resource, action, context)).to be false
      end
    end

    context "with expired permissions" do
      before do
        create(:permission_assignment, :for_user, :expired,
          group: create(:permission_group, :with_allow_permission),
          permissionable: user,)
      end

      it "returns false" do
        expect(resolver.can?(resource, action, context)).to be false
      end
    end
  end
end
