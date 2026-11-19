class Clients::EnrollmentsController < Clients::BaseController
  expose :enrollment, model: Client::Enrollment, scope: -> { client.enrollments }

  strong_params :enrollment, permit: [:vendor_id, :starts_on, :ends_on, :notes]

  # @route POST /clients/:client_slug/enrollments (client_enrollments)
  def create
    authorize_client_update!
    enrollment.assign_attributes(enrollment_params)

    enrollment.save
    redirect_to_client_tab("care")
  end

  # @route PATCH /clients/:client_slug/enrollments/:id (client_enrollment)
  # @route PUT /clients/:client_slug/enrollments/:id (client_enrollment)
  def update
    authorize_client_update!

    enrollment.update(enrollment_params)
    redirect_to_client_tab("care")
  end

  # @route DELETE /clients/:client_slug/enrollments/:id (client_enrollment)
  def destroy
    authorize_client_update!
    enrollment.destroy!
    redirect_to_client_tab("care")
  end
end
