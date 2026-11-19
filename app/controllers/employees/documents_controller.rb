class Employees::DocumentsController < Employees::BaseController
  def create
    authorize_employee_update!

    if params[:document].present?
      employee.documents.attach(params[:document])
    end

    redirect_to_employee_tab("documents")
  end

  def destroy
    authorize_employee_update!
    document = employee.documents.find(params.expect(:id))
    document.purge
    redirect_to_employee_tab("documents")
  end
end
