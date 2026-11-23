class Clients::HospitalVisitsController < Clients::BaseController
  expose :hospital_visit, model: Client::HospitalVisit, scope: -> { client.hospital_visits }

  strong_params :hospital_visit, permit: [
    :doctor_id, :incident_report_id, :hospital_name, :admitted_at, :discharged_at, :reason, :notes,
  ]

  # @route POST /clients/:client_slug/hospital_visits (client_hospital_visits)
  def create
    authorize_client_update!
    hospital_visit.assign_attributes(hospital_visit_params)
    hospital_visit.save
    redirect_to_client_tab("medical", section: "hospital_visits")
  end

  # @route PATCH /clients/:client_slug/hospital_visits/:id (client_hospital_visit)
  # @route PUT /clients/:client_slug/hospital_visits/:id (client_hospital_visit)
  def update
    authorize_client_update!
    hospital_visit.update(hospital_visit_params)
    redirect_to_client_tab("medical", section: "hospital_visits")
  end

  # @route DELETE /clients/:client_slug/hospital_visits/:id (client_hospital_visit)
  def destroy
    authorize_client_update!
    hospital_visit.destroy!
    redirect_to_client_tab("medical", section: "hospital_visits")
  end
end
