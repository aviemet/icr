require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Employees nested resources" do
  login_user(:admin)

  let(:employee) { create(:employee, :employed) }

  describe "support contacts" do
    it "creates a support contact" do
      expect {
        post employee_support_contacts_url(employee), params: {
          support_contact: {
            relationship: "family",
            priority: 1,
            is_emergency: true,
            person_attributes: {
              first_name: "Pat",
              last_name: "Lee",
              contact_attributes: {
                phones_attributes: [{ number: "555-0100", name: "Mobile" }]
              }
            }
          }
        }
      }.to change(Employee::SupportContact, :count).by(1)

      expect(response).to redirect_to(employee_url(employee, tab: "contacts"))
    end

    it "destroys a support contact" do
      support_contact = create(:employee_support_contact, employee: employee)
      expect {
        delete employee_support_contact_url(employee, support_contact)
      }.to change(Employee::SupportContact, :count).by(-1)
      expect(response).to redirect_to(employee_url(employee, tab: "contacts"))
    end
  end

  describe "credentials" do
    it "creates a credential" do
      expect {
        post employee_credentials_url(employee), params: {
          credential: {
            name: "First Aid",
            credential_type: "first_aid",
            expires_on: 1.year.from_now.to_date
          }
        }
      }.to change(Employee::Credential, :count).by(1)
      expect(response).to redirect_to(employee_url(employee, tab: "credentials"))
    end

    it "destroys a credential" do
      credential = create(:employee_credential, employee: employee)
      expect {
        delete employee_credential_url(employee, credential)
      }.to change(Employee::Credential, :count).by(-1)
    end
  end

  describe "clearances" do
    it "creates a clearance" do
      expect {
        post employee_clearances_url(employee), params: {
          clearance: {
            clearance_type: "physical",
            status: "cleared",
            cleared_on: Date.current
          }
        }
      }.to change(Employee::Clearance, :count).by(1)
      expect(response).to redirect_to(employee_url(employee, tab: "credentials"))
    end
  end

  describe "identifications" do
    it "creates an identification" do
      expect {
        post employee_identifications_url(employee), params: {
          identification: {
            id_type: "drivers_license",
            number: "D1234567",
            issued_at: Date.current,
            expires_at: 4.years.from_now.to_date
          }
        }
      }.to change(Identification, :count).by(1)
      expect(response).to redirect_to(employee_url(employee, tab: "credentials"))
    end
  end

  describe "pay rates" do
    it "creates a pay rate" do
      expect {
        post employee_pay_rates_url(employee), params: {
          pay_rate: {
            rate: "25.50",
            period: "hourly",
            starts_at: Time.current
          }
        }
      }.to change(Employee::PayRate, :count).by(1)
      expect(response).to redirect_to(employee_url(employee, tab: "pay"))
    end
  end

  describe "managers" do
    it "assigns a manager" do
      manager = create(:employee, :employed)
      expect {
        post employee_managers_url(employee), params: {
          employees_manager: {
            manager_id: manager.id,
            starts_at: Time.current,
            primary: true
          }
        }
      }.to change(Employee::EmployeesManager, :count).by(1)
      expect(response).to redirect_to(employee_url(employee, tab: "assignments"))
    end
  end

  describe "client attendants" do
    it "assigns an attended client" do
      client = create(:client)
      expect {
        post employee_client_attendants_url(employee), params: {
          clients_attendant: {
            client_id: client.id,
            starts_at: Time.current
          }
        }
      }.to change(ClientsAttendant, :count).by(1)
      expect(response).to redirect_to(employee_url(employee, tab: "assignments"))
    end
  end

  describe "trainings" do
    it "assigns a training" do
      training = create(:training)
      expect {
        post employee_trainings_url(employee), params: {
          employees_training: {
            training_id: training.id,
            started_at: Time.current
          }
        }
      }.to change(Employee::EmployeesTraining, :count).by(1)
      expect(response).to redirect_to(employee_url(employee, tab: "trainings"))
    end

    it "marks a training complete" do
      row = create(:employees_training, employee: employee, completed_at: nil, started_at: 1.day.ago)

      put employee_training_url(employee, row), params: {
        employees_training: { completed_at: Time.current.iso8601 }
      }

      expect(response).to redirect_to(employee_url(employee, tab: "trainings"))
      expect(row.reload.completed_at).to be_present
    end

    it "destroys a training assignment" do
      row = create(:employees_training, employee: employee)
      expect {
        delete employee_training_url(employee, row)
      }.to change(Employee::EmployeesTraining, :count).by(-1)
      expect(response).to redirect_to(employee_url(employee, tab: "trainings"))
    end
  end

  describe "documents" do
    it "attaches a document" do
      file = fixture_file_upload(
        Rails.root.join("spec/fixtures/files/sample.pdf"),
        "application/pdf",
      )
      expect {
        post employee_documents_url(employee), params: { document: file }
      }.to change { employee.reload.documents.count }.by(1)
      expect(response).to redirect_to(employee_url(employee, tab: "documents"))
    end
  end
end
