require "rails_helper"

RSpec.describe "/trainings", type: :request do
  login_user(:admin)

  def valid_attributes
    {
      training: attributes_for(:training)
    }
  end

  def invalid_attributes
    {
      training: { name: nil }
    }
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:training)
      get trainings_url
      expect(response).to be_successful
    end

    it "includes associated clients on each training and client filter options" do
      training = create(:training)
      client = create(:client)
      create(:clients_training, client: client, training: training)

      get trainings_url

      expect(response).to be_successful
      row = inertia.props[:trainings].find { |record| record[:id] == training.id }
      expect(row[:clients].pluck(:id)).to eq([client.id])
      expect(inertia.props[:client_options].pluck(:id)).to include(client.id)
    end

    it "filters trainings by associated client ids" do
      matching = create(:training, name: "Matching Training")
      other = create(:training, name: "Other Training")
      client = create(:client)
      create(:clients_training, client: client, training: matching)

      get trainings_url, params: { adv: true, client_ids: [client.id] }

      expect(response).to be_successful
      ids = inertia.props[:trainings].pluck(:id)
      expect(ids).to include(matching.id)
      expect(ids).not_to include(other.id)
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      training = create(:training)
      get training_url(training)
      expect(response).to be_successful
    end

    it "ships linked clients and assignments in lockstep" do
      training = create(:training)
      client = create(:client)
      clients_training = create(:clients_training, client: client, training: training, required: true)
      employee = create(:employee, :employed)
      assignment = create(:employees_training, employee: employee, training: training, started_at: Time.current)

      get training_url(training)

      expect(response).to be_successful
      props = inertia.props[:training]
      expect(props[:clients_trainings].pluck(:id)).to eq([clients_training.id])
      expect(props[:clients_trainings].first[:required]).to be(true)
      expect(props[:employees_trainings].pluck(:id)).to eq([assignment.id])
      expect(props[:employees_trainings].first[:employee][:id]).to eq(employee.id)
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_training_url
      expect(response).to be_successful
    end

    it "ships empty client_ids and client options" do
      client = create(:client)
      get new_training_url

      expect(response).to be_successful
      expect(inertia.props[:training][:client_ids]).to eq([])
      expect(inertia.props[:client_options].pluck(:id)).to include(client.id)
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      training = create(:training)
      get edit_training_url(training)
      expect(response).to be_successful
    end

    it "ships associated client_ids lockstep with client options" do
      training = create(:training)
      client = create(:client)
      create(:clients_training, client: client, training: training)

      get edit_training_url(training)

      expect(response).to be_successful
      client_ids = inertia.props[:training][:client_ids]
      option_ids = inertia.props[:client_options].pluck(:id)
      expect(client_ids).to eq([client.id.to_s])
      expect(option_ids).to include(client.id.to_s)
      expect(option_ids & client_ids).to eq(client_ids)
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Employee::Training" do
        expect {
          post trainings_url, params: valid_attributes
        }.to change(Employee::Training, :count).by(1)
      end

      it "redirects to the created training" do
        post trainings_url, params: valid_attributes
        expect(response).to redirect_to(training_url(Employee::Training.last))
      end

      it "associates clients when client_ids are provided" do
        client = create(:client)
        attrs = valid_attributes
        attrs[:training][:client_ids] = [client.id]

        expect {
          post trainings_url, params: attrs
        }.to change(ClientsTraining, :count).by(1)

        expect(Employee::Training.last.clients).to contain_exactly(client)
      end
    end

    context "with invalid parameters" do
      it "does not create a new Employee::Training" do
        expect {
          post trainings_url, params: invalid_attributes
        }.not_to change(Employee::Training, :count)
      end

      it "redirects back to the new training page" do
        post trainings_url, params: invalid_attributes
        expect(response).to redirect_to(new_training_url)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      it "syncs client associations from client_ids" do
        training = create(:training)
        keep_client = create(:client)
        drop_client = create(:client)
        add_client = create(:client)
        create(:clients_training, client: keep_client, training: training, required: true)
        create(:clients_training, client: drop_client, training: training)

        patch training_url(training), params: {
          training: { client_ids: [keep_client.id, add_client.id] },
        }

        expect(response).to redirect_to(training_url(training))
        expect(training.reload.clients).to contain_exactly(keep_client, add_client)
        expect(training.clients_trainings.find_by(client: keep_client).required).to be(true)
      end

      it "updates the requested training" do
        training = create(:training)
        new_attributes = { training: { name: "Updated Training Name", description: "Updated description" } }
        patch training_url(training), params: new_attributes
        training.reload
        expect(training.name).to eq("Updated Training Name")
        expect(training.description).to eq("Updated description")
      end

      it "redirects to the training" do
        training = create(:training)
        new_attributes = { training: { name: "Updated Training Name", description: "Updated description" } }
        patch training_url(training), params: new_attributes
        training.reload
        expect(response).to redirect_to(training_url(training))
      end
    end

    context "with invalid parameters" do
      it "redirects back to the edit training page" do
        training = create(:training)
        patch training_url(training), params: invalid_attributes
        expect(response).to redirect_to(edit_training_url(training))
      end
    end
  end

  describe "PUT /status" do
    it "retires an active training and returns to edit" do
      training = create(:training, status: :active)

      put status_training_url(training)

      expect(training.reload.status).to eq("inactive")
      expect(response).to redirect_to(edit_training_url(training))
    end

    it "offers an inactive training again and returns to edit" do
      training = create(:training, status: :inactive)

      put status_training_url(training)

      expect(training.reload.status).to eq("active")
      expect(response).to redirect_to(edit_training_url(training))
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested training" do
      training = create(:training)
      expect {
        delete training_url(training)
      }.to change(Employee::Training, :count).by(-1)
    end

    it "redirects to the trainings list" do
      training = create(:training)
      delete training_url(training)
      expect(response).to redirect_to(trainings_url)
    end
  end
end
