class TrainingsController < ApplicationController
  include Searchable

  expose :trainings, -> { policy_scope(search(Employee::Training.includes_associated)) }
  expose :training, scope: ->{ policy_scope(Employee::Training.includes_associated) }

  sortable_fields %w(name description estimated_minutes active_on inactive_on)

  strong_params :training, permit: [:name, :description, :estimated_minutes, :active_on, :inactive_on]

  # @route GET /employees/trainings (trainings)
  def index
    authorize trainings

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
    authorize training
    render inertia: "Trainings/Show", props: {
      training: -> { training.render(:show) }
    }
  end

  # @route GET /employees/trainings/new (new_training)
  def new
    authorize Employee::Training.new
    render inertia: "Trainings/New", props: {
      training: Employee::Training.new.render(:form_data)
    }
  end

  # @route GET /employees/trainings/:id/edit (edit_training)
  def edit
    authorize training
    render inertia: "Trainings/Edit", props: {
      training: training.render(:edit)
    }
  end

  # @route POST /employees/trainings (trainings)
  def create
    authorize Employee::Training.new
    if training.save
      redirect_to training, notice: t("templates.controllers.notices.created", model: "Training")
    else
      redirect_to new_training_path, inertia: { errors: training.errors }
    end
  end

  # @route PATCH /employees/trainings/:id (training)
  # @route PUT /employees/trainings/:id (training)
  def update
    authorize training
    if training.update(training_params)
      redirect_to training, notice: t("templates.controllers.notices.updated", model: "Training")
    else
      redirect_to edit_training_path(training), inertia: { errors: training.errors }
    end
  end

  # @route DELETE /employees/trainings/:id (training)
  def destroy
    authorize training
    training.destroy!
    redirect_to trainings_url, notice: t("templates.controllers.notices.destroyed", model: "Training")
  end
end
