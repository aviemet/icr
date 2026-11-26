require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::JobTitles", type: :request do
  login_user(:admin)

  describe "GET /index" do
    it "renders all job titles without pagination" do
      create(:job_title, name: "Coordinator")
      create(:job_title, name: "Specialist")

      get settings_job_titles_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/JobTitles/Index"
      names = inertia.props[:job_titles].pluck(:name)
      expect(names).to include("Coordinator", "Specialist")
      expect(names).to eq(names.sort)
      expect(inertia.props).not_to have_key(:pagination)
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      job_title = create(:job_title)

      get settings_job_title_url(job_title)

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/JobTitles/Show"
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_settings_job_title_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/JobTitles/New"
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      job_title = create(:job_title)

      get edit_settings_job_title_url(job_title)

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/JobTitles/Edit"
    end

    it "includes current permissions in props" do
      job_title = create(:job_title)
      job_title.add_role(:index, Client)
      job_title.add_role(:show, Client)

      get edit_settings_job_title_url(job_title.slug)
      expect(response).to be_successful

      client_permissions = inertia.props[:permissions][:client]
      expect(client_permissions[:index]).to be true
      expect(client_permissions[:show]).to be true
    end
  end

  describe "POST /settings/job_titles" do
    it "creates a job title and redirects to the index" do
      department = create(:department)

      expect {
        post settings_job_titles_url, params: {
          job_title: {
            name: "Coordinator",
            description: "Coordinates care",
            department_id: department.id,
          },
        }
      }.to change(Employee::JobTitle, :count).by(1)

      expect(response).to redirect_to(settings_job_titles_path)
    end
  end

  describe "PATCH /settings/job_titles/:slug" do
    it "updates a job title and redirects to the index" do
      job_title = create(:job_title, name: "Attendant")

      patch settings_job_title_url(job_title), params: {
        job_title: {
          name: "Lead Attendant",
          description: job_title.description,
          department_id: job_title.department_id,
        },
      }

      expect(response).to redirect_to(settings_job_titles_path)
      expect(job_title.reload.name).to eq("Lead Attendant")
    end

    it "persists rolify permissions from the matrix" do
      job_title = create(:job_title, name: "Facilitator")

      patch settings_job_title_url(job_title.slug), params: {
        job_title: {
          name: "Facilitator",
          description: "Manages clients and employees",
          department_id: job_title.department_id,
        },
        permissions: {
          admin: false,
          client: {
            index: true,
            show: true,
            create: false,
            update: false,
            delete: false,
          },
          employee: {
            index: true,
            show: true,
            create: false,
            update: false,
            delete: false,
          },
        },
      }

      expect(response).to redirect_to(settings_job_titles_path)
      job_title.reload
      expect(job_title.has_role?(:index, Client)).to be true
      expect(job_title.has_role?(:show, Client)).to be true
      expect(job_title.has_role?(:index, Employee)).to be true
      expect(job_title.has_role?(:update, Client)).to be false
    end

    it "persists complete on employee_training" do
      job_title = create(:job_title, name: "Facilitator")

      patch settings_job_title_url(job_title.slug), params: {
        job_title: {
          name: "Facilitator",
          description: job_title.description,
          department_id: job_title.department_id,
        },
        permissions: {
          admin: false,
          employee_training: {
            index: true,
            show: true,
            create: false,
            update: false,
            delete: false,
            complete: true,
          },
        },
      }

      expect(response).to redirect_to(settings_job_titles_path)
      job_title.reload
      expect(job_title.has_role?(:complete, Employee::Training)).to be true
      expect(job_title.has_role?(:index, Employee::Training)).to be true
    end

    it "persists time off approve without clearing create" do
      job_title = create(:job_title, name: "Facilitator")
      job_title.add_role(:create, TimeOff::Request)
      job_title.add_role(:show, TimeOff::Request)

      patch settings_job_title_url(job_title.slug), params: {
        job_title: {
          name: "Facilitator",
          description: job_title.description,
          department_id: job_title.department_id,
        },
        permissions: {
          admin: false,
          time_off_request: {
            index: true,
            show: true,
            create: true,
            update: false,
            delete: false,
            approve: true,
          },
        },
      }

      expect(response).to redirect_to(settings_job_titles_path)
      job_title.reload
      expect(job_title.has_role?(:approve, TimeOff::Request)).to be true
      expect(job_title.has_role?(:create, TimeOff::Request)).to be true
      expect(job_title.has_role?(:index, TimeOff::Request)).to be true
    end
  end

  describe "DELETE /settings/job_titles/:slug" do
    it "deletes the job title" do
      job_title = create(:job_title)

      expect {
        delete settings_job_title_url(job_title)
      }.to change(Employee::JobTitle, :count).by(-1)

      expect(response).to redirect_to(settings_job_titles_path)
      expect(Employee::JobTitle.exists?(job_title.id)).to be(false)
    end
  end
end
