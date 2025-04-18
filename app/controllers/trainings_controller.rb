class TrainingsController < ApplicationController
  include Searchable

  expose :trainings, -> { policy_scope(search(Training.includes_associated)) }
  expose :training, scope: ->{ policy_scope(Training.includes_associated) }

  sortable_fields %w(name description estimated_minutes active_on inactive_on)

  strong_params :training, permit: [:name, :description, :estimated_minutes, :active_on, :inactive_on]

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

  def show
    authorize training
    render inertia: "Trainings/Show", props: {
      training: -> { training.render(:show) }
    }
  end

  def new
    authorize Training.new
    render inertia: "Trainings/New", props: {
      training: Training.new.render(:form_data)
    }
  end

  def edit
    authorize training
    render inertia: "Trainings/Edit", props: {
      training: training.render(:edit)
    }
  end

  def create
    authorize Training.new
    if training.save
      redirect_to training, notice: "Training was successfully created."
    else
      redirect_to new_training_path, inertia: { errors: training.errors }
    end
  end

  def update
    authorize training
    if training.update(training_params)
      redirect_to training, notice: "Training was successfully updated."
    else
      redirect_to edit_training_path, inertia: { errors: training.errors }
    end
  end

  def destroy
    authorize training
    training.destroy!
    redirect_to trainings_url, notice: "Training was successfully destroyed."
  end
end
