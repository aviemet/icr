require "rails_helper"

RSpec.describe ApplicationPolicy do
  let(:record) { Client }
  let(:user) { stub_employee_user(job_title_roles: roles) }
  let(:roles) { [] }
  let(:policy) { described_class.new(user, record) }

  describe "standard authorization" do
    context "when user is an admin" do
      let(:user) { stub_admin_user }

      it "allows all actions" do
        expect(policy.index?).to be true
        expect(policy.show?).to be true
        expect(policy.create?).to be true
        expect(policy.update?).to be true
        expect(policy.destroy?).to be true
      end
    end

    context "when job title has resource roles" do
      let(:roles) { [[:show, Client], [:index, Client]] }

      it "allows permitted actions" do
        expect(policy.show?).to be true
        expect(policy.index?).to be true
      end

      it "denies non-permitted actions" do
        expect(policy.create?).to be false
        expect(policy.update?).to be false
        expect(policy.destroy?).to be false
      end
    end

    context "when job title has no roles" do
      it "denies actions" do
        expect(policy.index?).to be false
        expect(policy.show?).to be false
        expect(policy.create?).to be false
        expect(policy.update?).to be false
        expect(policy.destroy?).to be false
      end
    end
  end
end
