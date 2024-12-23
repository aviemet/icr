require 'rails_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to test the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator. If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails. There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.

RSpec.describe "/job_titles" do

  # This should return the minimal set of attributes required to create a valid
  # JobTitle. As you add validations to JobTitle, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  describe "GET /index" do
    it "renders a successful response" do
      JobTitle.create! valid_attributes
      get job_titles_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      job_title = JobTitle.create! valid_attributes
      get job_title_url(job_title)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_job_title_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      job_title = JobTitle.create! valid_attributes
      get edit_job_title_url(job_title)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new JobTitle" do
        expect {
          post job_titles_url, params: { job_title: valid_attributes }
        }.to change(JobTitle, :count).by(1)
      end

      it "redirects to the created job_title" do
        post job_titles_url, params: { job_title: valid_attributes }
        expect(response).to redirect_to(job_title_url(JobTitle.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new JobTitle" do
        expect {
          post job_titles_url, params: { job_title: invalid_attributes }
        }.not_to change(JobTitle, :count)
      end

      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post job_titles_url, params: { job_title: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end

    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested job_title" do
        job_title = JobTitle.create! valid_attributes
        patch job_title_url(job_title), params: { job_title: new_attributes }
        job_title.reload
        skip("Add assertions for updated state")
      end

      it "redirects to the job_title" do
        job_title = JobTitle.create! valid_attributes
        patch job_title_url(job_title), params: { job_title: new_attributes }
        job_title.reload
        expect(response).to redirect_to(job_title_url(job_title))
      end
    end

    context "with invalid parameters" do

      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        job_title = JobTitle.create! valid_attributes
        patch job_title_url(job_title), params: { job_title: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end

    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested job_title" do
      job_title = JobTitle.create! valid_attributes
      expect {
        delete job_title_url(job_title)
      }.to change(JobTitle, :count).by(-1)
    end

    it "redirects to the job_titles list" do
      job_title = JobTitle.create! valid_attributes
      delete job_title_url(job_title)
      expect(response).to redirect_to(job_titles_url)
    end
  end
end
