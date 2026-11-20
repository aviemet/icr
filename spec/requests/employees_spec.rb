require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/employees" do
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

    it "defaults to employed employees and excludes applicants" do
      employed = create(:employee, :employed)
      create(:employee)
      create(:employee, :terminated)

      get employees_url

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([employed.slug])
      expect(inertia.props[:pagination][:count]).to eq(1)
      expect(inertia.props[:workforce_view]).to eq("employed")
      expect(inertia.props[:can_scope_employees]).to be(true)
    end

    it "returns terminated employees when workforce_view=terminated" do
      terminated = create(:employee, :terminated)
      create(:employee, :employed)

      get employees_url, params: { workforce_view: "terminated" }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([terminated.slug])
      expect(inertia.props[:workforce_view]).to eq("terminated")
    end

    it "returns all statuses when workforce_view=all" do
      applicant = create(:employee)
      employed = create(:employee, :employed)

      get employees_url, params: { workforce_view: "all" }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to contain_exactly(applicant.slug, employed.slug)
      expect(inertia.props[:workforce_view]).to eq("all")
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

    it "filters by active_at date range" do
      matching = create(:employee, :employed, active_at: Date.new(2024, 3, 15))
      create(:employee, :employed, active_at: Date.new(2024, 1, 10))
      create(:employee, :employed, active_at: Date.new(2024, 7, 1))

      get employees_url, params: {
        adv: "true",
        active_at: { type: "range", start: "2024-03-01", end: "2024-03-31" }
      }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([matching.slug])
      expect(inertia.props[:pagination][:count]).to eq(1)
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

    it "ships overview props in lockstep for related collections" do
      employee = create(:employee, :employed)
      support_contact = create(:employee_support_contact, employee: employee, is_emergency: true)
      credential = create(:employee_credential, employee: employee, expires_on: 10.days.from_now)
      clearance = create(:employee_clearance, employee: employee, expires_on: 10.days.from_now)
      manager = create(:employee, :employed)
      create(:employees_manager, employee: employee, manager: manager, primary: true)
      client = create(:client)
      create(:clients_attendant, attendant: employee, client: client)
      training = create(:training)
      create(:employees_training, employee: employee, training: training, completed_at: nil, started_at: Time.current)
      create(:pay_rate, :active, employee: employee)

      get employee_url(employee)

      expect(response).to have_http_status(:ok)
      props = inertia.props[:employee]
      expect(props[:support_contacts].pluck(:id)).to eq([support_contact.id])
      expect(props[:credentials].pluck(:id)).to eq([credential.id])
      expect(props[:clearances].pluck(:id)).to eq([clearance.id])
      expect(props[:attended_clients].pluck(:id)).to eq([client.id])
      expect(props[:employees_trainings].pluck(:training_id)).to eq([training.id])
      expect(props[:emergency_contacts_count]).to eq(1)
      expect(props[:expiring_credentials_count]).to eq(1)
      expect(props[:expiring_clearances_count]).to eq(1)
      expect(props[:incomplete_trainings_count]).to eq(1)
      expect(props[:assigned_clients_count]).to eq(1)
      expect(props[:primary_manager][:id]).to eq(manager.id)
      expect(props[:pay_rates].size).to eq(1)
    end
  end

  describe "GET /status" do
    login_user(:admin)

    it "renders the status page" do
      employee = create(:employee)
      get status_employee_url(employee)
      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Employees/Status"
      expect(inertia.props[:employee][:slug]).to eq(employee.slug)
    end
  end

  describe "PUT /status" do
    login_user(:admin)

    it "begins employment via AASM" do
      employee = create(:employee)
      put status_employee_url(employee), params: {
        employee: { event: "begin_employment", active_at: Date.current }
      }
      expect(response).to redirect_to(employee_url(employee))
      expect(employee.reload).to be_employed
      expect(employee.active_at).to eq(Date.current)
    end

    it "withdraws an application via AASM" do
      employee = create(:employee)
      put status_employee_url(employee), params: {
        employee: { event: "withdraw_application", ineligibility_reason: "Not a fit" }
      }
      expect(response).to redirect_to(employee_url(employee))
      expect(employee.reload).to be_withdrawn
      expect(employee.ineligibility_reason).to eq("Not a fit")
    end

    it "marks an applicant not hired via AASM" do
      employee = create(:employee)
      put status_employee_url(employee), params: {
        employee: { event: "decline_application", ineligibility_reason: "Role filled" }
      }
      expect(response).to redirect_to(employee_url(employee))
      expect(employee.reload).to be_declined
      expect(employee.ineligibility_reason).to eq("Role filled")
    end

    it "terminates employment via AASM" do
      employee = create(:employee, :employed)
      put status_employee_url(employee), params: {
        employee: {
          event: "terminate",
          inactive_at: Date.current,
          termination_reason: "Performance",
          eligible_for_hire: false,
          terminate_immediately: true,
        }
      }
      expect(response).to redirect_to(employee_url(employee))
      expect(employee.reload).to be_terminated
      expect(employee.termination_reason).to eq("Performance")
      expect(employee.eligible_for_hire).to be(false)
    end

    it "schedules a future termination" do
      employee = create(:employee, :employed)
      put status_employee_url(employee), params: {
        employee: {
          event: "terminate",
          inactive_at: Date.current + 5.days,
          termination_reason: "Relocation",
          eligible_for_hire: true,
          terminate_immediately: false,
        }
      }
      expect(response).to redirect_to(employee_url(employee))
      employee.reload
      expect(employee).to be_employed
      expect(employee).to be_pending_termination
      expect(employee.termination_reason).to eq("Relocation")
    end

    it "cancels a pending termination" do
      employee = create(:employee, :employed)
      Employee::Offboard.call(
        employee: employee,
        attrs: { inactive_at: Date.current + 5.days, termination_reason: "Leaving" },
      )

      delete pending_termination_employee_url(employee)
      expect(response).to redirect_to(root_path)
      employee.reload
      expect(employee.inactive_at).to be_nil
      expect(employee).to be_employed
    end

    it "accepts an offer via AASM" do
      employee = create(:employee, :offered)
      put status_employee_url(employee), params: {
        employee: { event: "accept_offer", active_at: Date.current }
      }
      expect(response).to redirect_to(employee_url(employee))
      expect(employee.reload).to be_employed
    end

    it "rejects an offer via AASM" do
      employee = create(:employee, :offered)
      put status_employee_url(employee), params: {
        employee: { event: "reject_offer" }
      }
      expect(response).to redirect_to(employee_url(employee))
      expect(employee.reload).to be_declined
    end

    it "reconsiders a withdrawn application via AASM" do
      employee = create(:employee, :withdrawn)
      put status_employee_url(employee), params: {
        employee: { event: "reconsider", eligible_for_hire: true }
      }
      expect(response).to redirect_to(employee_url(employee))
      expect(employee.reload).to be_applicant
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

      it "creates an applicant without a start date" do
        attrs = valid_attributes
        attrs[:employee][:status] = "applicant"
        attrs[:employee].delete(:active_at)

        expect {
          post employees_url, params: attrs
        }.to change(Employee, :count).by(1)

        expect(Employee.last).to be_applicant
        expect(Employee.last.active_at).to be_nil
      end

      it "assigns a job title from job_title_id" do
        job_title = create(:job_title)
        attrs = valid_attributes
        attrs[:employee][:status] = "employed"
        attrs[:employee][:active_at] = Date.current
        attrs[:employee][:job_title_id] = job_title.id

        expect {
          post employees_url, params: attrs
        }.to change(Employee::EmployeesJobTitle, :count).by(1)

        employee = Employee.last
        expect(employee.job_title).to eq(job_title)
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

      it "redirects to the employee profile tab" do
        employee = create(:employee)
        patch employee_url(employee), params: { employee: { number: "CHANGED" } }
        employee.reload
        expect(response).to redirect_to(employee_url(employee, tab: "profile"))
      end

      it "persists color and preferred language" do
        employee = create(:employee)
        patch employee_url(employee), params: {
          employee: { color: "#112233", preferred_language: "Spanish" }
        }
        employee.reload
        expect(employee.color).to eq("#112233")
        expect(employee.preferred_language).to eq("Spanish")
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
