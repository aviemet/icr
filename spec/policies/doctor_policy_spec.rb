require "rails_helper"

RSpec.describe DoctorPolicy, type: :policy do
  before do
    @admin_user = create(:user).tap { |u| u.add_role(:admin) }
    @employee = create(:employee, :employed)
    @employee_user = create(:user, person: create(:person, employee: @employee))
    @client = create(:client)
    @client_user = create(:user, person: create(:person, client: @client))
    @job_title = create(:job_title)
    @employee_with_permission = create(:employee, :employed)
    @employee_with_permission.assign_job_title(@job_title)
    @employee_with_permission.reload
    @employee_user_with_permission = create(:user, person: create(:person, employee: @employee_with_permission))
  end

  describe ".scope" do
    it "returns all doctors for admin" do
      @doctors = create_list(:doctor, 3)
      scope = Pundit.policy_scope(@admin_user, Doctor)
      expect(scope.count).to eq(3)
      @doctors.each { |doctor| expect(scope).to include(doctor) }
    end

    it "returns all doctors for employee with index permission" do
      @job_title.add_role(:index, Doctor)
      @employee_with_permission.reload

      @doctors = create_list(:doctor, 3)
      scope = Pundit.policy_scope(@employee_user_with_permission, Doctor)
      expect(scope.count).to eq(3)
      @doctors.each { |doctor| expect(scope).to include(doctor) }
    end

    it "returns only doctors for clients employee attends" do
      client = create(:client)
      doctor = create(:doctor)
      create(:doctors_client, doctor: doctor, client: client)
      create(:clients_attendant, client: client, attendant: @employee, starts_at: 1.day.ago)
      other_doctor = create(:doctor)

      scope = Pundit.policy_scope(@employee_user, Doctor)
      expect(scope).to include(doctor)
      expect(scope).not_to include(other_doctor)
    end

    it "returns only doctors for client" do
      doctor = create(:doctor)
      create(:doctors_client, doctor: doctor, client: @client)
      other_doctor = create(:doctor)

      scope = Pundit.policy_scope(@client_user, Doctor)
      expect(scope).to include(doctor)
      expect(scope).not_to include(other_doctor)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      create_list(:doctor, 3)
      scope = Pundit.policy_scope(user, Doctor)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Doctor.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Doctor.new)).to authorize(:show)
    end
  end
end
