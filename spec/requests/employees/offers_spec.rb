require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Employees::Offers" do
  login_user(:admin)

  let(:job_title) { create(:job_title) }

  describe "POST /create for applicants" do
    let(:employee) { create(:employee) }

    it "creates an extended offer and moves the applicant to offered" do
      expect {
        post employee_offers_url(employee), params: {
          offer: {
            job_title_id: job_title.id,
            proposed_start_on: Date.current + 7,
            rate: "25.00",
            period: "hourly",
            status: "extended",
            commit: "offer",
            employee_number: "EMP-100",
          },
        }
      }.to change(Employee::Offer, :count).by(1)

      expect(response).to redirect_to(employee_url(employee, tab: "hiring"))
      expect(employee.reload).to be_offered
      expect(Employee::Offer.last).to be_extended
    end

    it "applies immediately when commit is apply" do
      post employee_offers_url(employee), params: {
        return_to: "status",
        offer: {
          job_title_id: job_title.id,
          proposed_start_on: Date.new(2026, 6, 1),
          rate: "30.00",
          period: "hourly",
          commit: "apply",
          employee_number: "EMP-300",
        },
      }

      expect(response).to redirect_to(status_employee_url(employee))
      employee.reload
      expect(employee).to be_employed
      expect(employee.job_title).to eq(job_title)
      expect(Employee::Offer.last).to be_accepted
    end
  end

  describe "POST /create for employed promotions" do
    let(:employee) { create(:employee, :employed) }
    let(:new_title) { create(:job_title, name: "Senior Attendant") }

    it "creates an open offer without changing status when commit is offer" do
      expect {
        post employee_offers_url(employee), params: {
          return_to: "status",
          offer: {
            job_title_id: new_title.id,
            proposed_start_on: Date.current + 14,
            rate: "28.00",
            period: "hourly",
            commit: "offer",
          },
        }
      }.to change(Employee::Offer, :count).by(1)

      expect(response).to redirect_to(status_employee_url(employee))
      expect(employee.reload).to be_employed
      expect(Employee::Offer.last).to be_extended
    end

    it "applies promotion immediately when commit is apply" do
      post employee_offers_url(employee), params: {
        return_to: "status",
        offer: {
          job_title_id: new_title.id,
          proposed_start_on: Date.new(2026, 7, 1),
          rate: "32.00",
          period: "hourly",
          commit: "apply",
        },
      }

      expect(response).to redirect_to(status_employee_url(employee))
      employee.reload
      expect(employee).to be_employed
      expect(employee.job_title).to eq(new_title)
      expect(employee.employees_job_titles.where(ends_at: nil).count).to eq(1)
      expect(Employee::Offer.last).to be_accepted
    end
  end

  describe "PATCH /update accept" do
    let(:employee) { create(:employee) }

    it "accepts the offer and applies employment terms" do
      offer = create(
        :employee_offer,
        :extended,
        employee: employee,
        job_title: job_title,
        proposed_start_on: Date.new(2026, 4, 1),
        rate_cents: 2800,
        employee_number: "EMP-280",
      )
      employee.make_offer! if employee.may_make_offer?

      patch employee_offer_url(employee, offer), params: {
        offer: { status: "accepted" },
      }

      expect(response).to redirect_to(employee_url(employee, tab: "hiring"))
      employee.reload
      expect(employee).to be_employed
      expect(employee.number).to eq("EMP-280")
      expect(employee.job_title).to eq(job_title)
      expect(offer.reload).to be_accepted
    end
  end

  describe "PATCH /update accept promotion" do
    let(:employee) { create(:employee, :employed) }
    let(:new_title) { create(:job_title, name: "Director Assistant") }

    it "lets a manager accept an open promotion offer" do
      offer = create(
        :employee_offer,
        :extended,
        employee: employee,
        job_title: new_title,
        proposed_start_on: Date.new(2026, 8, 1),
        rate_cents: 5000,
      )

      patch employee_offer_url(employee, offer), params: {
        return_to: "status",
        offer: { status: "accepted" },
      }

      expect(response).to redirect_to(status_employee_url(employee))
      employee.reload
      expect(employee).to be_employed
      expect(employee.job_title).to eq(new_title)
      expect(offer.reload).to be_accepted
    end
  end
end
