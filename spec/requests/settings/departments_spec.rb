require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::Departments", type: :request do
  login_user(:admin)

  describe "GET /index" do
    it "renders all departments without pagination" do
      create(:department, name: "Operations")
      create(:department, name: "Clinical")

      get settings_departments_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Departments/Index"
      names = inertia.props[:departments].map { |department| department[:name] }
      expect(names).to include("Operations", "Clinical")
      expect(names).to eq(names.sort)
      expect(inertia.props).not_to have_key(:pagination)
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      department = create(:department)

      get settings_department_url(department)

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Departments/Show"
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_settings_department_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Departments/New"
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      department = create(:department)

      get edit_settings_department_url(department)

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Departments/Edit"
    end
  end

  describe "POST /settings/departments" do
    it "creates a department and redirects to the index" do
      expect {
        post settings_departments_url, params: {
          department: {
            name: "Clinical",
            description: "Clinical services",
          },
        }
      }.to change(Employee::Department, :count).by(1)

      expect(response).to redirect_to(settings_departments_path)
    end
  end

  describe "PATCH /settings/departments/:slug" do
    it "updates a department and redirects to the index" do
      department = create(:department, name: "Temporary")

      patch settings_department_url(department), params: {
        department: {
          name: "Field Services",
          description: department.description,
        },
      }

      expect(response).to redirect_to(settings_departments_path)
      expect(department.reload.name).to eq("Field Services")
    end
  end

  describe "DELETE /settings/departments/:slug" do
    it "deletes the department" do
      department = create(:department)

      expect {
        delete settings_department_url(department)
      }.to change(Employee::Department, :count).by(-1)

      expect(response).to redirect_to(settings_departments_path)
      expect(Employee::Department.exists?(department.id)).to be(false)
    end

    it "nullifies associated job titles instead of destroying them" do
      department = create(:department)
      job_title = create(:job_title, department: department)

      expect {
        delete settings_department_url(department)
      }.not_to change(Employee::JobTitle, :count)

      expect(job_title.reload.department_id).to be_nil
    end
  end

  describe "DELETE /settings/departments" do
    it "bulk deletes departments by id" do
      first_department = create(:department)
      second_department = create(:department)
      kept_department = create(:department)

      expect {
        delete settings_departments_url, params: {
          ids: [first_department.id, second_department.id],
        }
      }.to change(Employee::Department, :count).by(-2)

      expect(response).to redirect_to(settings_departments_path)
      expect(Employee::Department.exists?(first_department.id)).to be(false)
      expect(Employee::Department.exists?(second_department.id)).to be(false)
      expect(Employee::Department.exists?(kept_department.id)).to be(true)
    end

    it "nullifies job titles for bulk-deleted departments" do
      department = create(:department)
      job_title = create(:job_title, department: department)

      delete settings_departments_url, params: { ids: [department.id] }

      expect(response).to redirect_to(settings_departments_path)
      expect(job_title.reload.department_id).to be_nil
      expect(Employee::JobTitle.exists?(job_title.id)).to be(true)
    end
  end
end
