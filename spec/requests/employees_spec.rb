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
      employee = create(:employee)
      get employees_url
      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Employees/Index"
      expect(inertia.props[:employees].first[:slug]).to eq(employee.slug)
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
