require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/employee/interviews", type: :request do
  login_user(:admin)

  def valid_attributes
    employee = create(:employee)
    {
      employee_interview: {
        **attributes_for(:interview).except(:employee_id),
        employee_id: employee.id
      }
    }
  end

  def invalid_attributes
    {
      employee_interview: { employee_id: nil }
    }
  end

  def new_attributes
    attributes_for(:interview).slice(:scheduled_at, :notes)
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:interview)
      get interviews_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      interview = create(:interview)
      get interview_url(interview)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_interview_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      interview = create(:interview)
      get edit_interview_url(interview)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Employee::Interview" do
        expect {
          post interviews_url, params: valid_attributes
        }.to change(Employee::Interview, :count).by(1)
      end

      it "redirects to the created employee_interview" do
        post interviews_url, params: valid_attributes
        expect(response).to redirect_to(interview_url(Employee::Interview.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Employee::Interview" do
        expect {
          post interviews_url, params: invalid_attributes
        }.not_to change(Employee::Interview, :count)
      end

      it "redirects to new interview" do
        post interviews_url, params: invalid_attributes
        expect(response).to redirect_to(new_interview_path)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      it "updates the requested employee_interview" do
        interview = create(:interview)
        attrs = new_attributes
        patch interview_url(interview), params: { employee_interview: attrs }
        interview.reload
        expect(interview.scheduled_at).to be_within(1.second).of(attrs[:scheduled_at])
        expect(interview.notes).to eq(attrs[:notes])
      end

      it "redirects to the employee_interview" do
        interview = create(:interview)
        patch interview_url(interview), params: { employee_interview: new_attributes }
        interview.reload
        expect(response).to redirect_to(interview_url(interview))
      end
    end

    context "with invalid parameters" do
      it "redirects to edit interview" do
        interview = create(:interview)
        patch interview_url(interview), params: invalid_attributes
        expect(response).to redirect_to(edit_interview_path(interview))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested employee_interview" do
      interview = create(:interview)
      expect {
        delete interview_url(interview)
      }.to change(Employee::Interview, :count).by(-1)
    end

    it "redirects to the employee_interviews list" do
      interview = create(:interview)
      delete interview_url(interview)
      expect(response).to redirect_to(interviews_url)
    end
  end
end
