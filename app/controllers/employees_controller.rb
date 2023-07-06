class EmployeesController < ApplicationController
  expose :employees, ->{ Employee.all }
  expose :employee

  # GET /employees
  def index
    render inertia: "Employees/Index", props: {
      employees: employees.render,
    }
  end

  # GET /employees/:id
  def show
    render inertia: "Employees/Show", props: {
      employee: employee.render,
    }
  end

  # GET /employees/new
  def new
    render inertia: "Employees/New", props: {
      employee: Employee.new.render,
    }
  end

  # GET /employees/:id/edit
  def edit
    render inertia: "Employees/Edit", props: {
      employee: employee.render,
    }
  end

  # POST /employees
  def create
    employee = Employee.new(example_params)

    if employee.save
      redirect_to employee_url(@employee), notice: "Employee was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /employees/:id
  def update
    if employee.update(employee_params)
      redirect_to employee_url(@employee), notice: "Employee was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /employees/:id
  def destroy
    employee.destroy
    redirect_to employees_url, notice: "Employee was successfully destroyed."
  end

  private

  def employee_params
    params.require(:employee).permit(:first_name, :last_name, :middle_name, :slug, :settings)
  end
end
