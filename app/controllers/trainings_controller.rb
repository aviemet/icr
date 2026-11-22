class TrainingsController < ApplicationController
  include Searchable

  expose :trainings, -> { policy_scope(search(Employee::Training.includes_associated)) }
  expose :training, -> { policy_scope(Employee::Training.includes_associated).find(params.expect(:id)) }

  sortable_fields %w(name description estimated_minutes status)

  advanced_search_method :client_ids, ->(model, _key, value) do
    ids = Array(value).filter_map { |entry| entry.to_s.presence }
    if ids.empty?
      model
    else
      model.where(id: ClientsTraining.where(client_id: ids).select(:training_id))
    end
  end

  strong_params :training, permit: [
    :name, :description, :estimated_minutes,
    { client_ids: [] },
  ]

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
      client_options: -> { training_client_options },
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

    form = Employee::Training.new.render(:form_data)
    form[:client_ids] = prefill_client_ids

    render inertia: "Trainings/New", props: {
      training: form,
      client_options: -> { training_client_options },
    }
  end

  # @route GET /employees/trainings/:id/edit (edit_training)
  def edit
    authorize training, policy_class: Employee::TrainingPolicy

    render inertia: "Trainings/Edit", props: {
      training: training.render(:edit),
      client_options: -> { training_client_options },
    }
  end

  # @route POST /employees/trainings (trainings)
  def create
    attrs = training_params
    client_ids = attrs[:client_ids]
    training = Employee::Training.new(attrs.except(:client_ids))
    authorize training, policy_class: Employee::TrainingPolicy

    if training.save
      sync_client_ids!(training, client_ids)
      redirect_to training_path(training), notice: t("templates.controllers.notices.created", model: "Employee::Training")
    else
      redirect_to new_training_path, inertia: { errors: training.errors }
    end
  end

  # @route PATCH /employees/trainings/:id (training)
  # @route PUT /employees/trainings/:id (training)
  def update
    authorize training, policy_class: Employee::TrainingPolicy

    attrs = training_params
    client_ids = attrs[:client_ids]

    if training.update(attrs.except(:client_ids))
      sync_client_ids!(training, client_ids)
      redirect_to training_path(training), notice: t("templates.controllers.notices.updated", model: "Employee::Training")
    else
      redirect_to edit_training_path(training), inertia: { errors: training.errors }
    end
  end

  # @route PUT /employees/trainings/:id/status (status_training)
  def update_status
    authorize training, :update?, policy_class: Employee::TrainingPolicy

    training.update!(status: training.active? ? :inactive : :active)
    redirect_to edit_training_path(training), notice: t("templates.controllers.notices.updated", model: "Employee::Training")
  end

  # @route DELETE /employees/trainings/:id (training)
  def destroy
    authorize training, policy_class: Employee::TrainingPolicy

    training.destroy!
    redirect_to trainings_url, notice: t("templates.controllers.notices.destroyed", model: "Employee::Training")
  end

  private

  def advanced_search_params
    params.permit(client_ids: [])
  end

  def prefill_client_ids
    ids = Array(params[:client_ids]).filter_map { |entry| entry.to_s.presence }.uniq
    return [] if ids.empty?

    policy_scope(Client).where(id: ids).pluck(:id).map(&:to_s)
  end

  def training_client_options
    policy_scope(Client).includes(:person).filter_map do |client|
      name = client.name.presence || client.slug
      next if name.blank?

      { id: client.id.to_s, name: name }
    end.sort_by { |option| option[:name].downcase }
  end

  def sync_client_ids!(record, client_ids)
    ids = Array(client_ids).filter_map { |entry| entry.to_s.presence }.uniq
    record.clients_trainings.where.not(client_id: ids).find_each(&:destroy!)
    existing_ids = record.clients_trainings.where(client_id: ids).pluck(:client_id).map(&:to_s)
    (ids - existing_ids).each do |client_id|
      record.clients_trainings.create!(client_id: client_id)
    end
  end
end
