class Clients::DoctorsController < Clients::BaseController
  # @route POST /clients/:client_slug/doctors (client_doctors)
  def create
    authorize_client_update!
    doctor = Doctor.find(params.require(:doctor_id))
    client.doctors << doctor unless client.doctors.include?(doctor)
    redirect_to_client_tab("health")
  end

  # @route DELETE /clients/:client_slug/doctors/:id (client_doctor)
  def destroy
    authorize_client_update!
    doctor = client.doctors.find(params.expect(:id))
    client.doctors.delete(doctor)
    redirect_to_client_tab("health")
  end
end
