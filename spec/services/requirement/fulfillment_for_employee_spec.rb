# frozen_string_literal: true

require "rails_helper"

RSpec.describe Requirement::FulfillmentForEmployee do
  let(:job_title) { create(:job_title) }
  let(:employee) do
    record = create(:employee, :employed)
    record.assign_job_title(job_title)
    record
  end

  let(:training_one) { create(:training, name: "Orientation") }
  let(:training_two) { create(:training, name: "Safety") }

  def create_requirement_with_trainings(name:, trainings:, scope: nil, enforcement: :advisory)
    requirement = create(:requirement, name: name, scope: scope, enforcement: enforcement)
    trainings.each do |training|
      create(:requirement_item, requirement: requirement, fulfillable: training)
    end
    requirement
  end

  it "marks a requirement met when all trainings are completed" do
    requirement = create_requirement_with_trainings(
      name: "Onboarding",
      trainings: [training_one, training_two],
    )
    create(:employees_training, :completed, employee: employee, training: training_one)
    create(:employees_training, :completed, employee: employee, training: training_two)

    result = described_class.call(employee)

    entry = result.requirements.find { |row| row.requirement_id == requirement.id }
    expect(entry.status).to eq("met")
    expect(entry.items.map(&:status)).to eq(["met", "met"])
    expect(result.met_count).to eq(1)
    expect(result.unmet_count).to eq(0)
  end

  it "marks credential items met when a non-expired credential exists" do
    requirement = create(:requirement, name: "DL")
    create(:requirement_item, :credential, requirement: requirement, credential_type: :drivers_license)
    create(:employee_credential, employee: employee, credential_type: :drivers_license, expires_on: 30.days.from_now)

    result = described_class.call(employee)
    entry = result.requirements.find { |row| row.requirement_id == requirement.id }

    expect(entry.status).to eq("met")
    expect(entry.items.first.kind).to eq("credential")
  end

  it "marks credential items unmet when expired or missing" do
    requirement = create(:requirement, name: "DL")
    create(:requirement_item, :credential, requirement: requirement, credential_type: :drivers_license)
    create(:employee_credential, employee: employee, credential_type: :drivers_license, expires_on: 1.day.ago)

    result = described_class.call(employee)
    entry = result.requirements.find { |row| row.requirement_id == requirement.id }

    expect(entry.status).to eq("unmet")
  end

  it "marks a requirement unmet when any training is incomplete or missing" do
    requirement = create_requirement_with_trainings(
      name: "Onboarding",
      trainings: [training_one, training_two],
    )
    create(:employees_training, :completed, employee: employee, training: training_one)
    create(:employees_training, employee: employee, training: training_two, completed_at: nil)

    result = described_class.call(employee)

    entry = result.requirements.find { |row| row.requirement_id == requirement.id }
    expect(entry.status).to eq("unmet")
    expect(entry.items.map(&:status)).to contain_exactly("met", "unmet")
  end

  it "marks a requirement with no items as met" do
    requirement = create(:requirement, name: "Empty")

    result = described_class.call(employee)

    entry = result.requirements.find { |row| row.requirement_id == requirement.id }
    expect(entry.status).to eq("met")
    expect(entry.items).to eq([])
  end

  it "includes company-wide and matching job title requirements only" do
    other_title = create(:job_title)
    company_wide = create_requirement_with_trainings(name: "Company", trainings: [training_one])
    matching = create_requirement_with_trainings(name: "Matching", scope: job_title, trainings: [training_two])
    create_requirement_with_trainings(name: "Other Title", scope: other_title, trainings: [training_two])

    result = described_class.call(employee)

    expect(result.requirements.map(&:requirement_id)).to contain_exactly(company_wide.id, matching.id)
  end
end
