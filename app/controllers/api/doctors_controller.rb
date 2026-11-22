class Api::DoctorsController < Api::ApiController
  expose :doctors, -> { policy_scope(Doctor.includes_associated) }

  # @route GET /api/options/doctors (api_doctors_options)
  def options
    render json: doctors.includes(person: []).render(:options)
  end
end
