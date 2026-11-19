class Employees::BaseController < ApplicationController
  expose :employee, id: -> { params[:employee_slug] || params[:slug] },
    scope: -> { policy_scope(Employee) },
    find_by: :slug

  before_action :authorize_employee!

  private

  def authorize_employee!
    authorize employee, :show?
  end

  def authorize_employee_update!
    authorize employee, :update?
  end

  def redirect_to_employee_tab(tab)
    redirect_to employee_path(employee, tab: tab)
  end
end
