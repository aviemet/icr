class EmployeesController < InertiaController
  before_action :set_employee, only: %i[show edit update destroy]
  before_action :set_employees, only: %i[index]

  # GET /employees
  def index
    render inertia: "Employees/Index", props: {
      employees: @employees.decorate.as_json,
    }
  end

  # GET /employees/:id
  def show
    render inertia: "Employees/Show", props: {
      employee: @employee.decorate.as_json,
    }
  end

  # GET /employees/new
  def new
    render inertia: "Employees/New", props: {
      employee: Employee.new.as_json,
    }
  end

  # GET /employees/:id/edit
  def edit
    render inertia: "Employees/Edit", props: {
      employee: @employee.as_json,
    }
  end

  # POST /employees
  def create
    @employee = Employee.new(example_params)

    if @employee.save
      redirect_to employee_url(@employee), notice: "Employee was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /employees/:id
  def update
    if @employee.update(employee_params)
      redirect_to employee_url(@employee), notice: "Employee was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /employees/:id
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
    params.require(:employee).permit(:f_name, :l_name, :m_name, :slug)
  end
end
