require "rails_helper"

RSpec.describe Employee::InterviewPolicy, type: :policy do
  let(:interview) { Employee::Interview.new }

  describe "permissions" do
    it "allows show when the job title can show employees" do
      user = stub_employee_user(job_title_roles: [[:show, Employee]])

      expect(described_class.new(user, interview)).to authorize(:show)
    end

    it "denies show when the job title cannot show employees" do
      user = stub_employee_user

      expect(described_class.new(user, interview)).not_to authorize(:show)
    end

    it "allows admin show without employee show role" do
      expect(described_class.new(stub_admin_user, interview)).to authorize(:show)
    end
  end

  describe "Scope" do
    let(:job_title) { create(:job_title) }
    let(:employee) { create(:employee, :employed).tap { |record| record.assign_job_title(job_title) } }
    let(:user) { create(:user, person: employee.person) }

    it "includes interviews when the job title can show employees" do
      job_title.add_role(:show, Employee)
      create_list(:interview, 2)

      expect(Pundit.policy_scope(user, Employee::Interview).count).to eq(2)
    end

    it "returns none when the job title cannot show employees" do
      create_list(:interview, 2)

      expect(Pundit.policy_scope(user, Employee::Interview)).to be_empty
    end
  end
end
