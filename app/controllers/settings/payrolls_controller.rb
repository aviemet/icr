class Settings::PayrollsController < ApplicationController
  # @route GET /settings/payroll (settings_payroll)
  def show
    authorize Setting

    render inertia: "Settings/Payroll", props: {
      settings: -> { Setting.render },
      shift_types: -> { Category.type "Shift" }
    }
  end
end
