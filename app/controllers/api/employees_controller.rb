class Api::EmployeesController < Api::ApiController
  expose :employee

  # PATCH/PUT /api/employees/:id
  def update
    if employee.update(employee_params)
      render json: employee.render, status: 201
    else
      render json: { errors: employee.errors }, status: 303
    end
  end

  def update_settings
    if employee.update_column(
      :settings,
      employee.settings.deep_merge(request.params[:employee][:settings]),
    )
      head :ok, content_type: "text/html"
    end
  end

  private

  def employee_params
    params.require(:employee).permit(:first_name, :last_name, :middle_name, :slug, :settings)
  end
end
