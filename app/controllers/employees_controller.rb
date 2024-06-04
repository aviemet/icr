class EmployeesController < ApplicationController
  include Searchable

  expose :employees, -> { search(Employee.includes_associated, sortable_fields) }
  expose :employee, scope: ->{ Employee }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /employees (employees)
  def index
    authorize employees
    render inertia: "Employee/Index", props: {
      employees: -> { employees.render(view: :index) }
    }
  end

  # @route GET /employees/:id (employee)
  def show
    authorize employee
    render inertia: "Employee/Show", props: {
      employee: -> { employee.render(view: :show) }
    }
  end

  # @route GET /employees/new (new_employee)
  def new
    authorize Employee.new
    render inertia: "Employee/New", props: {
      employee: Employee.new.render(view: :form_data)
    }
  end

  # @route GET /employees/:id/edit (edit_employee)
  def edit
    authorize employee
    render inertia: "Employee/Edit", props: {
      employee: employee.render(view: :edit)
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

  # @route PATCH /employees/:id (employee)
  # @route PUT /employees/:id (employee)
  def update
    authorize employee
    if employee.update(employee_params)
      redirect_to employee, notice: "Employee was successfully updated."
    else
      redirect_to edit_employee_path, inertia: { errors: employee.errors }
    end
  end

  # @route DELETE /employees/:id (employee)
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
