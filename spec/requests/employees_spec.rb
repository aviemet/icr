require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/employees", :inertia do
  def valid_attributes
    {
      employee: {
        **attributes_for(:employee),
        person_attributes: attributes_for(:person)
      }
    }
  end

  def invalid_attributes
    {
      employee: { person_attributes: { first_name: nil, last_name: nil } }
    }
  end

  describe "GET /index" do
    login_user(:admin)

    it "renders a successful response" do
      employee = create(:employee, :employed)
      get employees_url
      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Employees/Index"
      expect(inertia.props[:employees].first[:slug]).to eq(employee.slug)
    end

    it "defaults to employed employees when statuses is absent" do
      employed = create(:employee, :employed)
      create(:employee)

      get employees_url

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([employed.slug])
      expect(inertia.props[:pagination][:count]).to eq(1)
    end

    it "filters by statuses[]" do
      applicant = create(:employee)
      create(:employee, :employed)

      get employees_url, params: { adv: "true", statuses: ["applicant"] }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([applicant.slug])
      expect(inertia.props[:pagination][:count]).to eq(1)
    end

    it "returns all statuses when statuses is present but empty" do
      applicant = create(:employee)
      employed = create(:employee, :employed)

      get employees_url, params: { adv: "true", statuses: [""] }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to contain_exactly(applicant.slug, employed.slug)
      expect(inertia.props[:pagination][:count]).to eq(2)
    end

    it "filters with advanced search by number" do
      matching = create(:employee, :employed, number: "EMP-100")
      create(:employee, :employed, number: "EMP-200")

      get employees_url, params: { adv: "true", number: "EMP-100" }

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Employees/Index"
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([matching.slug])
      expect(inertia.props[:pagination][:count]).to eq(1)
    end

    it "filters with advanced search by created_at after date" do
      matching = create(:employee, :employed, created_at: Time.zone.parse("2024-06-15"))
      create(:employee, :employed, created_at: Time.zone.parse("2024-01-01"))

      get employees_url, params: {
        adv: "true",
        created_at: { type: "after", start: "2024-06-01" }
      }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([matching.slug])
    end

    it "filters by first_name" do
      matching = create(:employee, :employed, person: create(:person_with_contacts, first_name: "Ada"))
      create(:employee, :employed, person: create(:person_with_contacts, first_name: "Grace"))

      get employees_url, params: { adv: "true", first_name: "Ada" }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([matching.slug])
      expect(inertia.props[:pagination][:count]).to eq(1)
    end

    it "filters by job_title text and job_titles[]" do
      attendant = create(:job_title, name: "Attendant")
      manager = create(:job_title, name: "Manager")
      matching = create(:employee, :employed)
      other = create(:employee, :employed)
      create(:employees_job_title, employee: matching, job_title: attendant)
      create(:employees_job_title, employee: other, job_title: manager)

      get employees_url, params: { adv: "true", job_title: "Att", job_titles: ["Attendant"] }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([matching.slug])
      expect(inertia.props[:pagination][:count]).to eq(1)
    end

    it "composes column filters with search and keeps pagination count lockstep" do
      matching = create(:employee, :employed, number: "EMP-100", person: create(:person_with_contacts, first_name: "Ada", last_name: "Lovelace"))
      create(:employee, :employed, number: "EMP-200", person: create(:person_with_contacts, first_name: "Ada", last_name: "Other"))

      get employees_url, params: { adv: "true", search: "Lovelace", first_name: "Ada" }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([matching.slug])
      expect(inertia.props[:pagination][:count]).to eq(1)
    end

    it "includes ordered distinct job_title_options" do
      create(:job_title, name: "Zebra Role")
      create(:job_title, name: "Aardvark Role")

      get employees_url

      expect(response).to have_http_status(:ok)
      options = inertia.props[:job_title_options]
      expect(options).to include("Aardvark Role", "Zebra Role")
      expect(options).to eq(options.sort)
    end
  end

  describe "GET /show" do
    login_user(:admin)

    it "renders a successful response" do
      employee = create(:employee)
      get employee_url(employee)
      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Employees/Show"
      expect(inertia.props[:employee][:slug]).to eq(employee.slug)
    end
  end

  describe "GET /new" do
    login_user(:admin)

    it "renders a successful response" do
      get new_employee_url
      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Employees/New"
    end
  end

  describe "GET /edit" do
    login_user(:admin)

    it "renders a successful response" do
      employee = create(:employee)
      get edit_employee_url(employee)
      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Employees/Edit"
      expect(inertia.props[:employee][:slug]).to eq(employee.slug)
    end
  end

  describe "GET /schedule" do
    login_user(:admin)

    it "renders a successful response" do
      employee = create(:employee)

      get schedule_employee_url(employee)

      expect(response).to be_successful
      expect_inertia.to render_component "Employees/Schedule"
    end
  end

  describe "POST /create" do
    login_user(:admin)

    context "with valid parameters" do
      it "creates a new Employee" do
        expect {
          post employees_url, params: valid_attributes
        }.to change(Employee, :count).by(1)
      end

      it "redirects to the created employee" do
        post employees_url, params: valid_attributes
        expect(response).to redirect_to(employee_url(Employee.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Employee" do
        expect {
          post employees_url, params: invalid_attributes
        }.not_to change(Employee, :count)
      end

      it "redirects back to the new employee page" do
        post employees_url, params: invalid_attributes
        expect(response).to redirect_to(new_employee_url)
      end
    end
  end

  describe "PATCH /update" do
    login_user(:admin)

    context "with valid parameters" do
      it "updates the requested employee" do
        employee = create(:employee)
        patch employee_url(employee), params: { employee: { number: "CHANGED" } }
        employee.reload
        expect(employee.number).to eq("CHANGED")
      end

      it "redirects to the employee" do
        employee = create(:employee)
        patch employee_url(employee), params: { employee: { number: "CHANGED" } }
        employee.reload
        expect(response).to redirect_to(employee_url(employee))
      end
    end

    context "with invalid parameters" do
      it "redirects back to the edit employee page" do
        employee = create(:employee)
        patch employee_url(employee), params: invalid_attributes
        expect(response).to redirect_to(edit_employee_url(employee))
      end
    end
  end

  describe "DELETE /destroy" do
    login_user(:admin)

    it "destroys the requested employee" do
      employee = create(:employee)
      expect {
        delete employee_url(employee)
      }.to change(Employee, :count).by(-1)
    end

    it "redirects to the employees list" do
      employee = create(:employee)
      delete employee_url(employee)
      expect(response).to redirect_to(employees_url)
    end
  end
end
