class Api::SpotlightsController < Api::ApiController
  # @route GET /api/spotlights (api_spotlights)
  def index
    query = params[:q].to_s.strip

    return render json: [] if query.blank?

    employees = policy_scope(Employee.includes_associated).search(query).limit(10)
    clients = policy_scope(Client.includes_associated).search(query).limit(10)
    trainings = policy_scope(Employee::Training.includes_associated).search(query).limit(10)
    doctors = policy_scope(Doctor.includes_associated).search(query).limit(10)
    households = Household.search(query).limit(10)
    vendors = policy_scope(Vendor.includes_associated).search(query).limit(10)

    results = []
    results.concat(employees.render(:spotlight))
    results.concat(clients.render(:spotlight))
    results.concat(trainings.render(:spotlight))
    results.concat(doctors.render(:spotlight))
    results.concat(households.render(:spotlight))
    results.concat(vendors.render(:spotlight))

    render json: results
  end
end
