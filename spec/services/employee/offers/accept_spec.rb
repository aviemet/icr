require "rails_helper"

RSpec.describe Employee::Offers::Accept do
  let(:job_title) { create(:job_title) }

  describe "for applicants" do
    let(:employee) { create(:employee) }
    let(:offer) do
      create(
        :employee_offer,
        :extended,
        employee: employee,
        job_title: job_title,
        proposed_start_on: Date.new(2026, 3, 1),
        rate_cents: 3200,
        period: :hourly,
        employee_number: "EMP-ACCEPT",
      )
    end

    it "applies offer terms and employs the applicant" do
      described_class.call(offer: offer)

      employee.reload
      offer.reload

      expect(offer).to be_accepted
      expect(employee).to be_employed
      expect(employee.active_at).to eq(Date.new(2026, 3, 1))
      expect(employee.number).to eq("EMP-ACCEPT")
      expect(employee.job_title).to eq(job_title)
      expect(employee.pay_rates.count).to eq(1)
      expect(employee.pay_rates.first.rate_cents).to eq(3200)
      expect(employee.pay_rates.first).to be_hourly
    end

    it "rejects accepting a terminal offer" do
      offer.update!(status: :accepted)

      expect {
        described_class.call(offer: offer)
      }.to raise_error(ArgumentError)
    end

    it "blocks hire when employment requirements are unmet" do
      employee.update!(desired_job_title: job_title)
      requirement = create(:requirement, :employment, :for_job_title, scope: job_title, name: "Driver License")
      create(:requirement_item, :credential, requirement: requirement, credential_type: :drivers_license)

      expect {
        described_class.call(offer: offer)
      }.to raise_error(ArgumentError, /Driver License/)

      expect(employee.reload).to be_applicant
      expect(offer.reload).to be_extended
    end

    it "hires when employment requirements are met" do
      employee.update!(desired_job_title: job_title)
      requirement = create(:requirement, :employment, :for_job_title, scope: job_title, name: "Driver License")
      create(:requirement_item, :credential, requirement: requirement, credential_type: :drivers_license)
      create(:employee_credential, employee: employee, credential_type: :drivers_license, expires_on: 1.year.from_now)

      described_class.call(offer: offer)

      expect(employee.reload).to be_employed
      expect(offer.reload).to be_accepted
    end
  end

  describe "for employed promotions" do
    let(:employee) { create(:employee, :employed) }
    let(:new_title) { create(:job_title, name: "Lead Facilitator") }
    let(:offer) do
      create(
        :employee_offer,
        :extended,
        employee: employee,
        job_title: new_title,
        proposed_start_on: Date.new(2026, 5, 1),
        rate_cents: 4500,
        period: :hourly,
      )
    end

    it "applies title and pay without changing employment status" do
      described_class.call(offer: offer)

      employee.reload
      offer.reload

      expect(offer).to be_accepted
      expect(employee).to be_employed
      expect(employee.job_title).to eq(new_title)
      expect(employee.employees_job_titles.where(ends_at: nil).count).to eq(1)
      expect(employee.pay_rates.where(ends_at: nil).last.rate_cents).to eq(4500)
    end
  end
end
