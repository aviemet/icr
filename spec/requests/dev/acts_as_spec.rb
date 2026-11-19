# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Dev::ActsAs", type: :request do
  login_admin

  let(:job_title) { create(:job_title) }
  let(:facilitator) { create(:employee, :employed) }
  let!(:facilitator_user) do
    create(:user, person: facilitator.person).tap do
      facilitator.assign_job_title(job_title)
      facilitator.reload
    end
  end

  before do
    job_title.add_role(:index, Client)
    job_title.add_role(:show, Client)
    allow(DevActsAs).to receive(:enabled?).and_return(true)
  end

  describe "POST /dev/acts_as" do
    it "switches effective user and shared permissions to the target" do
      Rails.cache.write("user_permissions/#{@admin.id}", { "settings" => { "index" => true } })
      Rails.cache.write("user_permissions/#{facilitator_user.id}", { "stale" => true })

      post dev_acts_as_path, params: { user_id: facilitator_user.id }
      expect(response).to redirect_to(root_path)

      expect(Rails.cache.read("user_permissions/#{@admin.id}")).to be_nil
      expect(Rails.cache.read("user_permissions/#{facilitator_user.id}")).to be_nil

      follow_redirect!
      expect(response).to be_successful

      props = inertia.props.deep_symbolize_keys
      auth = props.fetch(:auth)
      permissions = props.fetch(:permissions)

      expect(auth.fetch(:user).fetch(:email)).to eq(facilitator_user.email)
      expect(auth.fetch(:acts_as).fetch(:active)).to be(true)
      expect(auth.fetch(:acts_as).fetch(:true_user).fetch(:email)).to eq(@admin.email)
      expect(auth.fetch(:acts_as).fetch(:acting_user).fetch(:email)).to eq(facilitator_user.email)
      expect(permissions.dig(:settings, :index)).to be(false)
      expect(permissions.dig(:clients, :index)).to be(true)
    end
  end

  describe "DELETE /dev/acts_as" do
    it "restores the true user and admin-shaped permissions" do
      post dev_acts_as_path, params: { user_id: facilitator_user.id }
      delete dev_acts_as_path
      expect(response).to redirect_to(root_path)

      get root_path
      expect(response).to be_successful

      props = inertia.props.deep_symbolize_keys
      auth = props.fetch(:auth)
      permissions = props.fetch(:permissions)

      expect(auth.fetch(:user).fetch(:email)).to eq(@admin.email)
      expect(auth.fetch(:acts_as).fetch(:active)).to be(false)
      expect(auth.fetch(:acts_as).fetch(:acting_user)).to be_nil
      expect(permissions.dig(:settings, :index)).to be(true)
    end
  end

  context "when acts as is disabled" do
    before { allow(DevActsAs).to receive(:enabled?).and_return(false) }

    it "does not override current_user when a session value is present" do
      post dev_acts_as_path, params: { user_id: facilitator_user.id }
      expect(response).to have_http_status(:not_found)

      allow(DevActsAs).to receive(:enabled?).and_return(true)
      post dev_acts_as_path, params: { user_id: facilitator_user.id }

      allow(DevActsAs).to receive(:enabled?).and_return(false)
      get root_path
      expect(response).to be_successful

      props = inertia.props.deep_symbolize_keys
      expect(props.fetch(:auth).fetch(:user).fetch(:email)).to eq(@admin.email)
      expect(props.fetch(:auth)).not_to have_key(:acts_as)
    end
  end
end
