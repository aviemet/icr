# == Schema Information
#
# Table name: employees
#
#  id          :uuid             not null, primary key
#  active_at   :date
#  color       :string
#  inactive_at :date
#  number      :string
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :uuid             not null
#
# Indexes
#
#  index_employees_on_person_id  (person_id)
#  index_employees_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
require "rails_helper"
require "models/shared/participantable"

RSpec.describe Employee do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:employee)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i().each do |attr|
        expect(build(:employee, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it_behaves_like "participantable"

    it{ is_expected.to belong_to(:person) }

    it{ is_expected.to have_many(:job_titles).through(:employees_job_titles) }
    it{ is_expected.to have_one(:job_title).through(:active_employees_job_title) }
    it{ is_expected.to have_many(:pay_rates) }

    it { is_expected.to have_many(:shifts) }
    it { is_expected.to have_many(:shift_events).through(:shifts) }

    it{ is_expected.to have_many(:managed_employees).through(:managed_employees_managers) }
    it{ is_expected.to have_many(:managers).through(:managers_employees_managers) }

    describe "managers" do
      it "assigns a manager" do
        employee = create(:employee)
        manager = create(:employee)

        employee.managers << manager

        expect(employee.managers).to eq([manager])
        expect(manager.managed_employees).to eq([employee])
      end

      it "assigns a managed employee" do
        employee = create(:employee)
        manager = create(:employee)

        manager.managed_employees << employee

        expect(manager.managed_employees).to eq([employee])
        expect(employee.managers).to eq([manager])
      end
    end

    it{ is_expected.to have_many(:all_managed_clients).through(:clients_managers) }
    it{ is_expected.to have_many(:managed_clients).through(:active_clients_managers) }

    describe "managed clients" do
      it "assigns a manager" do
        employee = create(:employee)
        client = create(:client)

        employee.managed_clients << client
        employee.reload

        expect(employee.managed_clients).to eq([client])
      end

      it "assigns a managed client" do
        employee = create(:employee)
        client = create(:client)

        client.managers << employee

        expect(client.managers).to eq([employee])
      end
    end

    it{ is_expected.to have_many(:all_attended_clients).through(:clients_attendants) }
    it{ is_expected.to have_many(:attended_clients).through(:active_clients_attendants) }

    describe "attended clients" do
      it "assigns an attendant" do
        employee = create(:employee)
        client = create(:client)

        employee.attended_clients << client
        employee.reload

        expect(employee.attended_clients).to eq([client])
      end

      it "assigns an attended client" do
        employee = create(:employee)
        client = create(:client)

        client.attendants << employee

        expect(client.attendants).to eq([employee])
      end
    end
  end

  describe "#job_title=" do
    it "assigns the job title" do
      employee = create(:employee)
      job_title = create(:job_title)

      employee.job_title = job_title

      expect(employee.job_title).to eq(job_title)
    end

    it "doesn't assign the same job title" do
      employee = create(:employee)
      job_title = create(:job_title)

      employee.job_title = job_title
      employee.job_title = job_title

      expect(employee.job_title).to eq(job_title)
      expect(employee.job_titles.count).to eq(1)
    end

    it "deactivates the current job title" do
      employee = create(:employee)
      job_title = create(:job_title)
      old_job_title = create(:job_title)
      employee.job_title = old_job_title

      employee.job_title = job_title

      expect(employee.job_title).to eq(job_title)
      expect(employee.job_titles.count).to eq(2)
      expect(employee.employees_job_titles.last.ends_at).to be_nil
    end
  end

  describe "#all_events" do
    it "returns all events" do
      employee = create(:employee)
      shift = create(:shift, employee: employee)
      event = create(:calendar_event)
      employee.calendar_events << event

      expect(employee.all_events).to eq([shift.calendar_event, event])
    end
  end
end
