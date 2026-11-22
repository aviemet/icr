require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/settings/requirements", type: :request do
  login_user(:admin)

  def valid_attributes(training_ids: [], credential_types: [], enforcement: "advisory", scope: {})
    requirement_type = create(:requirement_type)
    {
      requirement: {
        **attributes_for(:requirement).except(:requirement_type_id, :enforcement),
        requirement_type_id: requirement_type.id,
        enforcement: enforcement,
        training_ids: training_ids,
        credential_types: credential_types,
        **scope,
      }
    }
  end

  def invalid_attributes
    {
      requirement: { name: nil, requirement_type_id: nil }
    }
  end

  def new_attributes
    attributes_for(:requirement).slice(:name, :description)
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:requirement)
      get settings_requirements_url
      expect(response).to be_successful
    end

    it "includes type name, scope label, enforcement, and fulfillable counts" do
      requirement = create(:requirement, name: "CPR Ready", enforcement: :advisory)
      training = create(:training)
      create(:requirement_item, requirement: requirement, fulfillable: training)
      create(:requirement_item, :credential, requirement: requirement, credential_type: :first_aid)

      get settings_requirements_url

      row = inertia.props[:requirements].find { |record| record[:id] == requirement.id }
      expect(row[:type_name]).to eq(requirement.requirement_type.name)
      expect(row[:scope_label]).to eq("Company-wide")
      expect(row[:enforcement]).to eq("advisory")
      expect(row[:trainings_count]).to eq(1)
      expect(row[:credentials_count]).to eq(1)
    end
  end

  describe "GET /show" do
    it "renders a successful response with items" do
      requirement = create(:requirement)
      training = create(:training, name: "Orientation")
      create(:requirement_item, requirement: requirement, fulfillable: training)

      get settings_requirement_url(requirement)

      expect(response).to be_successful
      props = inertia.props[:requirement]
      expect(props[:type_name]).to eq(requirement.requirement_type.name)
      expect(props[:training_ids]).to eq([training.id])
      expect(props[:requirement_items].pluck(:fulfillable_id)).to eq([training.id])
      expect(props[:requirement_items].first[:name]).to eq("Orientation")
    end
  end

  describe "GET /new" do
    it "renders a successful response with option lists" do
      type = create(:requirement_type)
      job_title = create(:job_title)
      client = create(:client, :with_profile)
      training = create(:training)

      get new_settings_requirement_url

      expect(response).to be_successful
      expect(inertia.props[:requirement][:training_ids]).to eq([])
      expect(inertia.props[:requirement][:credential_types]).to eq([])
      expect(inertia.props[:requirement_type_options].pluck(:id)).to include(type.id)
      expect(inertia.props[:job_title_options].pluck(:id)).to include(job_title.id)
      expect(inertia.props[:client_options].pluck(:id)).to include(client.id)
      expect(inertia.props[:training_options].pluck(:id)).to include(training.id)
      expect(inertia.props[:credential_type_options].pluck(:id)).to include("drivers_license")
    end
  end

  describe "GET /edit" do
    it "ships associated training_ids and credential_types" do
      requirement = create(:requirement)
      training = create(:training)
      create(:requirement_item, requirement: requirement, fulfillable: training)
      create(:requirement_item, :credential, requirement: requirement, credential_type: :drivers_license)

      get edit_settings_requirement_url(requirement)

      expect(response).to be_successful
      expect(inertia.props[:requirement][:training_ids]).to eq([training.id])
      expect(inertia.props[:requirement][:credential_types]).to eq(["drivers_license"])
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a requirement and syncs training items" do
        training = create(:training)

        expect {
          post settings_requirements_url, params: valid_attributes(training_ids: [training.id])
        }.to change(Requirement::Requirement, :count).by(1)
          .and change(Requirement::Item, :count).by(1)

        created = Requirement::Requirement.order(:created_at).last
        expect(created.training_ids).to eq([training.id])
        expect(response).to redirect_to(settings_requirement_url(created))
      end

      it "creates a client-scoped schedule requirement with credential types" do
        client = create(:client)
        expect {
          post settings_requirements_url, params: valid_attributes(
            credential_types: ["drivers_license"],
            enforcement: "client_schedule",
            scope: { scope_type: "Client", scope_id: client.id },
          )
        }.to change(Requirement::Requirement, :count).by(1)
          .and change(Requirement::Item, :count).by(1)

        created = Requirement::Requirement.order(:created_at).last
        expect(created).to be_client_schedule
        expect(created.scope).to eq(client)
        expect(created.credential_types).to eq(["drivers_license"])
      end
    end

    context "with invalid parameters" do
      it "does not create a requirement" do
        expect {
          post settings_requirements_url, params: invalid_attributes
        }.not_to change(Requirement::Requirement, :count)
        expect(response).to redirect_to(new_settings_requirement_path)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      it "updates the requirement and training items" do
        requirement = create(:requirement)
        keep = create(:training)
        drop = create(:training)
        add = create(:training)
        create(:requirement_item, requirement: requirement, fulfillable: keep)
        create(:requirement_item, requirement: requirement, fulfillable: drop)
        attrs = new_attributes

        patch settings_requirement_url(requirement), params: {
          requirement: attrs.merge(training_ids: [keep.id, add.id]),
        }

        requirement.reload
        expect(requirement.name).to eq(attrs[:name])
        expect(requirement.training_ids).to contain_exactly(keep.id, add.id)
        expect(response).to redirect_to(settings_requirement_url(requirement))
      end
    end

    context "with invalid parameters" do
      it "redirects to edit requirement" do
        requirement = create(:requirement)
        patch settings_requirement_url(requirement), params: invalid_attributes
        expect(response).to redirect_to(edit_settings_requirement_path(requirement))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requirement" do
      requirement = create(:requirement)
      expect {
        delete settings_requirement_url(requirement)
      }.to change(Requirement::Requirement, :count).by(-1)
      expect(response).to redirect_to(settings_requirements_url)
    end
  end
end
