class Employees::PayRatesController < Employees::BaseController
  expose :pay_rate, model: Employee::PayRate, scope: -> { employee.pay_rates }

  strong_params :pay_rate, permit: [
    :rate, :rate_cents, :rate_currency, :period, :starts_at, :ends_at, :notes,
  ]

  # @route POST /employees/:employee_slug/pay_rates (employee_pay_rates)
  def create
    authorize_employee_update!
    pay_rate.assign_attributes(pay_rate_params)
    pay_rate.save
    redirect_to_employee_tab("pay")
  end

  # @route PATCH /employees/:employee_slug/pay_rates/:id (employee_pay_rate)
  # @route PUT /employees/:employee_slug/pay_rates/:id (employee_pay_rate)
  def update
    authorize_employee_update!
    pay_rate.update(pay_rate_params)
    redirect_to_employee_tab("pay")
  end

  # @route DELETE /employees/:employee_slug/pay_rates/:id (employee_pay_rate)
  def destroy
    authorize_employee_update!
    pay_rate.destroy!
    redirect_to_employee_tab("pay")
  end
end
