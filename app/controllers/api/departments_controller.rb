class Api::DepartmentsController < ApplicationController
  expose :departments, -> { policy_scope(Employee::Department.includes_associated) }
  expose :department, id: ->{ params[:slug] }, scope: ->{ policy_scope(Employee::Department.includes_associated) }, find_by: :slug

  # @route GET /api/options/departments (api_departments_options)
  def options
    render json: departments.render(:options)
  end
end
