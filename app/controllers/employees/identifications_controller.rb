class Employees::IdentificationsController < Employees::BaseController
  expose :identification, scope: -> { employee.identifications }

  strong_params :identification, permit: [
    :id_type, :number, :notes, :issued_at, :expires_at, :category_id,
  ]

  # @route POST /employees/:employee_slug/identifications (employee_identifications)
  def create
    authorize_employee_update!
    identification.assign_attributes(identification_params)
    identification.save
    redirect_to_employee_tab("credentials")
  end

  # @route PATCH /employees/:employee_slug/identifications/:id (employee_identification)
  # @route PUT /employees/:employee_slug/identifications/:id (employee_identification)
  def update
    authorize_employee_update!
    identification.update(identification_params)
    redirect_to_employee_tab("credentials")
  end

  # @route DELETE /employees/:employee_slug/identifications/:id (employee_identification)
  def destroy
    authorize_employee_update!
    identification.destroy!
    redirect_to_employee_tab("credentials")
  end
end
