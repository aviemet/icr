class TrainingsController < ApplicationController
  include Searchable

  expose :trainings, -> { policy_scope(search(Employee::Training.includes_associated)) }
  expose :training, -> { policy_scope(Employee::Training.includes_associated).find(params[:id]) }

  sortable_fields %w(name description estimated_minutes active_on inactive_on)

  strong_params :training, permit: [:name, :description, :estimated_minutes, :active_on, :inactive_on]

  # @route GET /employees/trainings (trainings)
  def index
    authorize trainings, policy_class: Employee::TrainingPolicy

    paginated_trainings = paginate(trainings, :trainings)

    render inertia: "Trainings/Index", props: {
      trainings: -> { paginated_trainings.render(:index) },
      pagination: -> { {
        count: trainings.size,
        **pagination_data(paginated_trainings)
      } },
    }
  end

  # @route GET /employees/trainings/:id (training)
  def show
    authorize training, policy_class: Employee::TrainingPolicy

    render inertia: "Trainings/Show", props: {
      training: -> { training.render(:show) }
    }
  end

  # @route GET /employees/trainings/new (new_training)
  def new
    authorize Employee::Training.new, policy_class: Employee::TrainingPolicy

    render inertia: "Trainings/New", props: {
      training: Employee::Training.new.render(:form_data)
    }
  end

  # @route GET /employees/trainings/:id/edit (edit_training)
  def edit
    authorize training, policy_class: Employee::TrainingPolicy

    render inertia: "Trainings/Edit", props: {
      training: training.render(:edit)
    }
  end

  # @route POST /employees/trainings (trainings)
  def create
    training = Employee::Training.new(training_params)
    authorize training, policy_class: Employee::TrainingPolicy

    if training.save
      redirect_to training_path(training), notice: t("templates.controllers.notices.created", model: "Employee::Training")
    else
      redirect_to new_training_path, inertia: { errors: training.errors }
    end
  end

  # @route PATCH /employees/trainings/:id (training)
  # @route PUT /employees/trainings/:id (training)
  def update
    authorize training, policy_class: Employee::TrainingPolicy

    if training.update(training_params)
      redirect_to training_path(training), notice: t("templates.controllers.notices.updated", model: "Employee::Training")
    else
      redirect_to edit_training_path(training), inertia: { errors: training.errors }
    end
  end

  # @route DELETE /employees/trainings/:id (training)
  def destroy
    authorize training, policy_class: Employee::TrainingPolicy

    training.destroy!
    redirect_to trainings_url, notice: t("templates.controllers.notices.destroyed", model: "Employee::Training")
  end
end
