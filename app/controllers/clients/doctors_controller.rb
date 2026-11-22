class Clients::DoctorsController < Clients::BaseController
  # @route POST /clients/:client_slug/doctors (client_doctors)
  def create
    authorize_client_update!
    doctor = Doctor.find(params.require(:doctor_id))
    doctors_client = client.doctors_clients.find_or_initialize_by(doctor_id: doctor.id)
    doctors_client.notes = params[:notes] if params.key?(:notes)
    doctors_client.save!
    redirect_to_client_tab("medical")
  end

  # @route DELETE /clients/:client_slug/doctors/:id (client_doctor)
  def destroy
    authorize_client_update!
    doctor = client.doctors.friendly.find(params.expect(:id))
    client.doctors_clients.find_by!(doctor_id: doctor.id).destroy!
    redirect_to_client_tab("medical")
  end
end
