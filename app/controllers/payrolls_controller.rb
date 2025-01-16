class PayrollsController < ApplicationController

  # @route GET /payrolls (payrolls)
  def index
    render inertia: "Payroll/Index"
  end
end
