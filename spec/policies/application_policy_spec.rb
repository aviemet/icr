require "rails_helper"

RSpec.describe ApplicationPolicy do
  let(:user) { create(:user) }
  let(:employee) { create(:employee, :employed, person: user.person) }
  let(:job_title) { create(:job_title) }
  let(:record) { create(:client, person: create(:person)) }
  let(:policy) { described_class.new(user, record) }

  before do
    employee.assign_job_title(job_title)
    employee.reload
    user.reload
  end

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

    context "when job title has resource roles" do
      before do
        job_title.add_role(:show, Client)
        job_title.add_role(:index, Client)
      end

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
