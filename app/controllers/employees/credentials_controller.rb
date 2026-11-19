class Employees::CredentialsController < Employees::BaseController
  expose :credential, model: Employee::Credential, scope: -> { employee.credentials }

  strong_params :credential, permit: [
    :name, :credential_type, :number, :issued_on, :expires_on, :notes,
  ]

  def create
    authorize_employee_update!
    credential.assign_attributes(credential_params)
    credential.save
    redirect_to_employee_tab("credentials")
  end

  def update
    authorize_employee_update!
    credential.update(credential_params)
    redirect_to_employee_tab("credentials")
  end

  def destroy
    authorize_employee_update!
    credential.destroy!
    redirect_to_employee_tab("credentials")
  end
end
