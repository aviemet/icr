class Employees::PayRatesController < Employees::BaseController
  expose :pay_rate, model: Employee::PayRate, scope: -> { employee.pay_rates }

  strong_params :pay_rate, permit: [
    :rate, :rate_cents, :rate_currency, :period, :starts_at, :ends_at, :notes,
  ]

  def create
    authorize_employee_update!
    pay_rate.assign_attributes(pay_rate_params)
    pay_rate.save
    redirect_to_employee_tab("pay")
  end

  def update
    authorize_employee_update!
    pay_rate.update(pay_rate_params)
    redirect_to_employee_tab("pay")
  end

  def destroy
    authorize_employee_update!
    pay_rate.destroy!
    redirect_to_employee_tab("pay")
  end
end
