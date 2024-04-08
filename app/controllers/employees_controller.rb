class EmployeesController < InertiaController
  before_action :set_employee, only: %i[show edit update destroy]
  before_action :set_employees, only: %i[index]

  # @route GET /employees (employees)
  def index
    render inertia: "Employees/Index", props: {
      employees: @employees.decorate.as_json,
    }
  end

  # @route GET /employees/:id (employee)
  def show
    render inertia: "Employees/Show", props: {
      employee: @employee.decorate.as_json,
    }
  end

  # @route GET /employees/new (new_employee)
  def new
    render inertia: "Employees/New", props: {
      employee: Employee.new.as_json,
    }
  end

  # @route GET /employees/:id/edit (edit_employee)
  def edit
    render inertia: "Employees/Edit", props: {
      employee: @employee.as_json,
    }
  end

  # @route POST /employees (employees)
  def create
    @employee = Employee.new(example_params)

    if @employee.save
      redirect_to employee_url(@employee), notice: "Employee was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # @route PATCH /employees/:id (employee)
  # @route PUT /employees/:id (employee)
  def update
    if @employee.update(employee_params)
      redirect_to employee_url(@employee), notice: "Employee was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # @route DELETE /employees/:id (employee)
  def destroy
    @employee.destroy
    redirect_to employees_url, notice: "Employee was successfully destroyed."
  end

  private

  def set_employee
    @employee = Employee.find(class_name, params[:id])
  end

  def set_employees
    @employees = Employee.all
  end

  def employee_params
    params.require(:employee).permit(:first_name, :last_name, :middle_name, :slug)
  end
end
