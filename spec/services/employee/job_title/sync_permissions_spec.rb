require "rails_helper"

RSpec.describe Employee::JobTitle::SyncPermissions do
  let(:job_title) { create(:job_title) }

  describe ".call" do
    it "adds roles for enabled permissions" do
      described_class.call(job_title, {
        "admin" => false,
        "client" => {
          "index" => true,
          "show" => true,
          "create" => false,
          "update" => false,
          "delete" => false,
        },
      })

      expect(job_title.has_role?(:index, Client)).to be true
      expect(job_title.has_role?(:show, Client)).to be true
      expect(job_title.has_role?(:create, Client)).to be false
      expect(job_title.has_role?(:destroy, Client)).to be false
    end

    it "maps delete to destroy" do
      described_class.call(job_title, {
        "client" => { "delete" => true },
      })

      expect(job_title.has_role?(:destroy, Client)).to be true
    end

    it "removes roles that are no longer enabled" do
      job_title.add_role(:index, Client)
      job_title.add_role(:show, Client)

      described_class.call(job_title, {
        "client" => {
          "index" => true,
          "show" => false,
          "create" => false,
          "update" => false,
          "delete" => false,
        },
      })

      expect(job_title.has_role?(:index, Client)).to be true
      expect(job_title.has_role?(:show, Client)).to be false
    end

    it "grants all catalogued actions when admin is true" do
      described_class.call(job_title, { "admin" => true })

      Employee::JobTitle::PermissionsCatalog::RESOURCES.each do |key, resource_class|
        Employee::JobTitle::PermissionsCatalog.actions_for(key).each do |action|
          expect(job_title.has_role?(action.to_sym, resource_class)).to be true
        end
      end
    end

    it "grants complete on employee_training when enabled" do
      described_class.call(job_title, {
        "employee_training" => { "complete" => true },
      })

      expect(job_title.has_role?(:complete, Employee::Training)).to be true
    end

    it "invalidates permission caches for users with the job title" do
      employee = create(:employee, :employed)
      user = create(:user, person: employee.person)
      employee.assign_job_title(job_title)
      employee.reload

      cache_key = "user_permissions/#{user.id}"
      Rails.cache.write(cache_key, { "clients" => { "index" => true } })

      described_class.call(job_title, {
        "client" => { "index" => true },
      })

      expect(Rails.cache.read(cache_key)).to be_nil
    end

    it "preserves roles for catalog resources absent from the payload" do
      job_title.add_role(:index, ReportDefinition)
      job_title.add_role(:show, ReportDefinition)
      job_title.add_role(:index, Client)

      described_class.call(job_title, {
        "client" => {
          "index" => false,
          "show" => true,
          "create" => false,
          "update" => false,
          "delete" => false,
        },
      })

      expect(job_title.has_role?(:index, Client)).to be false
      expect(job_title.has_role?(:show, Client)).to be true
      expect(job_title.has_role?(:index, ReportDefinition)).to be true
      expect(job_title.has_role?(:show, ReportDefinition)).to be true
    end
  end
end
