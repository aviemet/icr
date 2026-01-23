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
  end

  describe "GET /show" do
    it "renders a successful response" do
      training = create(:training)
      get training_url(training)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_training_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      training = create(:training)
      get edit_training_url(training)
      expect(response).to be_successful
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
