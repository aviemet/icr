class Settings::OvertimeExemptionsController < ApplicationController
  expose :overtime_exemption

  strong_params :overtime_exemption do
    result = permit(:name, :active)
    if key?(:criteria)
      result[:criteria] = Array(self[:criteria]).map { |group|
        group.respond_to?(:to_unsafe_h) ? group.to_unsafe_h : group
      }
    end
    result
  end

  # @route POST /settings/overtime_exemptions (settings_overtime_exemptions)
  def create
    authorize OvertimeExemption.new

    overtime_exemption.assign_attributes(overtime_exemption_params)

    if overtime_exemption.save
      redirect_to settings_payroll_overtime_path, notice: t("templates.controllers.notices.created", model: "Overtime exemption")
    else
      redirect_to settings_payroll_overtime_path, inertia: { errors: overtime_exemption.errors }
    end
  end

  # @route PATCH /settings/overtime_exemptions/:id (settings_overtime_exemption)
  # @route PUT /settings/overtime_exemptions/:id (settings_overtime_exemption)
  def update
    authorize overtime_exemption

    if overtime_exemption.update(overtime_exemption_params)
      redirect_to settings_payroll_overtime_path, notice: t("templates.controllers.notices.updated", model: "Overtime exemption")
    else
      redirect_to settings_payroll_overtime_path, inertia: { errors: overtime_exemption.errors }
    end
  end
end
