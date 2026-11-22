# == Schema Information
#
# Table name: requirements
#
#  id                  :uuid             not null, primary key
#  description         :text
#  enforcement         :integer          default("advisory"), not null
#  name                :string
#  scope_type          :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  requirement_type_id :uuid             not null
#  scope_id            :uuid
#
# Indexes
#
#  index_requirements_on_enforcement          (enforcement)
#  index_requirements_on_requirement_type_id  (requirement_type_id)
#  index_requirements_on_scope                (scope_type,scope_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_type_id => requirement_types.id)
#
require "rails_helper"

RSpec.describe Requirement::Requirement do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:requirement)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:requirement, attr => nil)).not_to be_valid
      end
    end

    it "allows company-wide scope" do
      expect(build(:requirement, scope: nil)).to be_valid
    end

    it "allows job title scope" do
      expect(create(:requirement, :for_job_title)).to be_valid
    end

    it "allows client scope for client_schedule" do
      expect(create(:requirement, :for_client)).to be_valid
    end

    it "rejects unsupported scope types" do
      requirement = build(:requirement, scope_type: "Vendor", scope_id: SecureRandom.uuid)
      expect(requirement).not_to be_valid
      expect(requirement.errors[:scope_type]).to be_present
    end

    it "rejects scope type without scope id" do
      requirement = build(:requirement, scope_type: "Employee::JobTitle", scope_id: nil)
      expect(requirement).not_to be_valid
      expect(requirement.errors[:scope_id]).to be_present
    end

    it "rejects client_schedule without client scope" do
      requirement = build(:requirement, enforcement: :client_schedule, scope: nil)
      expect(requirement).not_to be_valid
      expect(requirement.errors[:enforcement]).to be_present
    end

    it "rejects employment with client scope" do
      client = create(:client)
      requirement = build(:requirement, enforcement: :employment, scope: client)
      expect(requirement).not_to be_valid
      expect(requirement.errors[:enforcement]).to be_present
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:requirement_type).class_name("Requirement::Type") }
    it { is_expected.to belong_to(:scope).optional }
    it { is_expected.to have_many(:requirement_items).class_name("Requirement::Item").dependent(:destroy) }
    it { is_expected.to have_many(:trainings).through(:requirement_items).source(:fulfillable) }
  end

  describe ".applicable_to" do
    let(:job_title) { create(:job_title) }
    let(:other_title) { create(:job_title) }
    let(:employee) do
      record = create(:employee, :employed)
      record.assign_job_title(job_title)
      record
    end

    let!(:company_wide) { create(:requirement, name: "Company Wide") }
    let!(:matching_title) { create(:requirement, :for_job_title, name: "Matching", scope: job_title) }
    let!(:other_scoped) { create(:requirement, :for_job_title, name: "Other", scope: other_title) }

    it "returns company-wide and matching job title requirements" do
      ids = described_class.applicable_to(employee).pluck(:id)
      expect(ids).to contain_exactly(company_wide.id, matching_title.id)
      expect(ids).not_to include(other_scoped.id)
    end

    it "uses desired_job_title when no active title" do
      applicant = create(:employee, desired_job_title: job_title)
      ids = described_class.applicable_to(applicant).pluck(:id)
      expect(ids).to contain_exactly(company_wide.id, matching_title.id)
    end

    it "includes client-scoped requirements for attended clients" do
      client = create(:client)
      create(:clients_attendant, attendant: employee, client: client)
      client_requirement = create(:requirement, :for_client, name: "Client Protocol", scope: client)

      ids = described_class.applicable_to(employee.reload).pluck(:id)
      expect(ids).to include(company_wide.id, matching_title.id, client_requirement.id)
    end
  end

  describe ".for_employment_gate" do
    let(:job_title) { create(:job_title) }
    let(:employee) { create(:employee, desired_job_title: job_title) }

    it "returns employment requirements for company-wide and desired job title" do
      company = create(:requirement, :employment, name: "Company DL")
      title = create(:requirement, :employment, :for_job_title, scope: job_title, name: "Title DL")
      create(:requirement, name: "Advisory")
      client = create(:client)
      create(:requirement, :for_client, scope: client, name: "Client Gate")

      ids = described_class.for_employment_gate(employee).pluck(:id)
      expect(ids).to contain_exactly(company.id, title.id)
    end
  end

  describe ".for_client_schedule_gate" do
    it "returns only client_schedule requirements for that client" do
      client = create(:client)
      other = create(:client)
      matching = create(:requirement, :for_client, scope: client, name: "Match")
      create(:requirement, :for_client, scope: other, name: "Other")
      create(:requirement, :employment, name: "Hire")

      ids = described_class.for_client_schedule_gate(create(:employee), client).pluck(:id)
      expect(ids).to eq([matching.id])
    end
  end

  describe "#sync_training_ids!" do
    let(:requirement) { create(:requirement) }
    let(:training_one) { create(:training) }
    let(:training_two) { create(:training) }
    let(:training_three) { create(:training) }

    it "creates items for new training ids and removes missing ones" do
      create(:requirement_item, requirement: requirement, fulfillable: training_one)
      create(:requirement_item, requirement: requirement, fulfillable: training_two)

      requirement.sync_training_ids!([training_two.id, training_three.id])

      expect(requirement.reload.training_ids).to contain_exactly(training_two.id, training_three.id)
    end
  end

  describe "#sync_credential_types!" do
    let(:requirement) { create(:requirement) }

    it "creates and removes credential items" do
      create(:requirement_item, :credential, requirement: requirement, credential_type: :cpr)

      requirement.sync_credential_types!(["drivers_license", "first_aid"])

      expect(requirement.reload.credential_types).to contain_exactly("drivers_license", "first_aid")
    end
  end

  describe "#scope_label" do
    it "returns Company-wide when unscoped" do
      expect(build(:requirement, scope: nil).scope_label).to eq("Company-wide")
    end

    it "returns the job title name when scoped" do
      job_title = build(:job_title, name: "Facilitator")
      expect(build(:requirement, scope: job_title).scope_label).to eq("Facilitator")
    end
  end
end
