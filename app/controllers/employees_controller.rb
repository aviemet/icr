class EmployeesController < ApplicationController
  include Searchable

  expose :employees, -> { search(Employee.includes_associated, sortable_fields) }
  expose :employee, scope: ->{ Employee }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /employees (employees)
  def index
    authorize employees
    render inertia: "Employee/Index", props: {
      employees: -> { employees.render(:index) }
    }
  end

  # @route GET /employees/:slug (employee)
  def show
    authorize employee
    render inertia: "Employee/Show", props: {
      employee: -> { employee.render(:show) }
    }
  end

  # @route GET /employees/new (new_employee)
  def new
    authorize Employee.new
    render inertia: "Employee/New", props: {
      employee: Employee.new.render(:form_data)
    }
  end

  # @route GET /employees/:slug/edit (edit_employee)
  def edit
    authorize employee
    render inertia: "Employee/Edit", props: {
      employee: employee.render(:edit)
    }
  end

  # @route POST /employees (employees)
  def create
    authorize Employee.new
    if employee.save
      redirect_to employee, notice: "Employee was successfully created."
    else
      redirect_to new_employee_path, inertia: { errors: employee.errors }
    end
  end

  # @route PATCH /employees/:slug (employee)
  # @route PUT /employees/:slug (employee)
  def update
    authorize employee
    if employee.update(employee_params)
      redirect_to employee, notice: "Employee was successfully updated."
    else
      redirect_to edit_employee_path, inertia: { errors: employee.errors }
    end
  end

  # @route DELETE /employees/:slug (employee)
  def destroy
    authorize employee
    employee.destroy!
    redirect_to employees_url, notice: "Employee was successfully destroyed."
  end

  private

  def sortable_fields
    %w(person_id active_at inactive_at number).freeze
  end

  def employee_params
    params.require(:employee).permit(:person_id, :active_at, :inactive_at, :number)
  end
end
