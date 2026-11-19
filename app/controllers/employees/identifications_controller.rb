class Employees::IdentificationsController < Employees::BaseController
  expose :identification, scope: -> { employee.identifications }

  strong_params :identification, permit: [
    :id_type, :number, :notes, :issued_at, :expires_at, :category_id,
  ]

  def create
    authorize_employee_update!
    identification.assign_attributes(identification_params)
    identification.save
    redirect_to_employee_tab("credentials")
  end

  def update
    authorize_employee_update!
    identification.update(identification_params)
    redirect_to_employee_tab("credentials")
  end

  def destroy
    authorize_employee_update!
    identification.destroy!
    redirect_to_employee_tab("credentials")
  end
end
