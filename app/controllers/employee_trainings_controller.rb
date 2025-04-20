class EmployeeTrainingsController < ApplicationController
  include Searchable

  expose :employee, -> { policy_scope(Employee).friendly.find(params[:employee_slug]) }
  expose :employee_trainings, -> { policy_scope(search(employee.employee_trainings.includes_associated)) }
  expose :employee_training, scope: -> { policy_scope(employee.employee_trainings.includes_associated) }

  sortable_fields %w(completed_at status notes)

  strong_params :employee_training, permit: [:completed_at, :status, :notes]

  # @route GET /employees/:employee_slug/trainings (employee_employee_trainings)
  def index
    authorize employee_trainings

    paginated_trainings = paginate(employee_trainings, :employee_trainings)

    render inertia: "EmployeeTrainings/Index", props: {
      employee: -> { employee.render(:show) },
      employee_trainings: -> { paginated_trainings.render(:index) },
      pagination: -> { {
        count: employee_trainings.size,
        **pagination_data(paginated_trainings)
      } },
    }
  end

  # @route GET /employees/:employee_slug/trainings/:id (employee_employee_training)
  def show
    authorize employee_training
    render inertia: "EmployeeTrainings/Show", props: {
      employee: -> { employee.render(:show) },
      employee_training: -> { employee_training.render(:show) }
    }
  end

  # @route GET /employees/:employee_slug/trainings/new (new_employee_employee_training)
  def new
    authorize EmployeeTraining.new(employee: employee)
    render inertia: "EmployeeTrainings/New", props: {
      employee: -> { employee.render(:show) },
      trainings: -> { Training.active.render(:index) }
    }
  end

  # @route GET /employees/:employee_slug/trainings/:id/edit (edit_employee_employee_training)
  def edit
    authorize employee_training
    render inertia: "EmployeeTrainings/Edit", props: {
      employee: -> { employee.render(:show) },
      employee_training: -> { employee_training.render(:edit) }
    }
  end

  # @route POST /employees/:employee_slug/trainings (employee_employee_trainings)
  def create
    @employee_training = employee.employee_trainings.build(employee_training_params)
    authorize @employee_training

    if @employee_training.save
      redirect_to employee_training_path(employee, @employee_training),
        notice: "Training was successfully assigned."
    else
      redirect_to new_employee_training_path(employee),
        inertia: { errors: @employee_training.errors }
    end
  end

  # @route PATCH /employees/:employee_slug/trainings/:id (employee_employee_training)
  # @route PUT /employees/:employee_slug/trainings/:id (employee_employee_training)
  def update
    authorize employee_training
    if employee_training.update(employee_training_params)
      redirect_to employee_training_path(employee, employee_training),
        notice: "Training record was successfully updated."
    else
      redirect_to edit_employee_training_path(employee, employee_training),
        inertia: { errors: employee_training.errors }
    end
  end

  # @route DELETE /employees/:employee_slug/trainings/:id (employee_employee_training)
  def destroy
    authorize employee_training
    employee_training.destroy!
    redirect_to employee_trainings_path(employee),
      notice: "Training record was successfully removed."
  end
end
