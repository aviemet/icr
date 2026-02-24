require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/doctors" do
  def valid_attributes
    {
      doctor: {
        **attributes_for(:doctor),
        person_attributes: attributes_for(:person)
      }
    }
  end

  def invalid_attributes
    {
      doctor: { person_attributes: { first_name: nil, last_name: nil } }
    }
  end

  describe "GET /index" do
    login_user(:admin)

    it "renders a successful response" do
      create(:doctor)
      get doctors_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    login_user(:admin)

    it "renders a successful response" do
      doctor = create(:doctor)
      get doctor_url(doctor)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    login_user(:admin)

    it "renders a successful response" do
      get new_doctor_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    login_user(:admin)

    it "renders a successful response" do
      doctor = create(:doctor)
      get edit_doctor_url(doctor)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    login_user(:admin)

    context "with valid parameters" do
      it "creates a new Doctor" do
        expect {
          post doctors_url, params: valid_attributes
        }.to change(Doctor, :count).by(1)
      end

      it "redirects to the created doctor" do
        post doctors_url, params: valid_attributes
        expect(response).to redirect_to(doctor_url(Doctor.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Doctor" do
        expect {
          post doctors_url, params: invalid_attributes
        }.not_to change(Doctor, :count)
      end

      it "redirects back to the new doctor page" do
        post doctors_url, params: invalid_attributes
        expect(response).to redirect_to(new_doctor_url)
      end
    end
  end

  describe "PATCH /update" do
    login_user(:admin)

    context "with valid parameters" do
      it "updates the requested doctor" do
        doctor = create(:doctor)
        new_person_attrs = attributes_for(:person)

        patch doctor_url(doctor), params: {
          doctor: { person_attributes: { id: doctor.person.id, **new_person_attrs } }
        }
        doctor.reload

        expect(doctor.person.first_name).to eq(new_person_attrs[:first_name])
        expect(doctor.person.last_name).to eq(new_person_attrs[:last_name])
      end

      it "redirects to the doctor" do
        doctor = create(:doctor)
        patch doctor_url(doctor), params: {
          doctor: { person_attributes: { id: doctor.person.id, **attributes_for(:person) } }
        }
        doctor.reload
        expect(response).to redirect_to(doctor_url(doctor))
      end
    end

    context "with invalid parameters" do
      it "redirects back to the edit doctor page" do
        doctor = create(:doctor)
        patch doctor_url(doctor), params: invalid_attributes.deep_merge(
          doctor: { person_attributes: { id: doctor.person.id } },
        )
        expect(response).to redirect_to(edit_doctor_url(doctor))
      end
    end
  end

  describe "DELETE /destroy" do
    login_user(:admin)

    it "destroys the requested doctor" do
      doctor = create(:doctor)
      expect {
        delete doctor_url(doctor)
      }.to change(Doctor, :count).by(-1)
    end

    it "redirects to the doctors list" do
      doctor = create(:doctor)
      delete doctor_url(doctor)
      expect(response).to redirect_to(doctors_url)
    end
  end
end
