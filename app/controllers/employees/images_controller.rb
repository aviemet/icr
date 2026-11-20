class Employees::ImagesController < Employees::BaseController
  # @route POST /employees/:employee_slug/images (employee_images)
  def create
    authorize_employee_update!

    if params[:image].present?
      employee.images.attach(params[:image])
    end

    redirect_to_employee_tab("documents")
  end

  # @route DELETE /employees/:employee_slug/images/:id (employee_image)
  def destroy
    authorize_employee_update!
    image = employee.images.find(params.expect(:id))
    image.purge
    redirect_to_employee_tab("documents")
  end
end
