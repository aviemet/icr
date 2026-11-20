class CaseloadsController < ApplicationController
  expose :clients_manager, model: ClientsManager

  strong_params :clients_manager, permit: [:client_id, :manager_id]

  # @route GET /caseloads (caseloads)
  def index
    authorize ClientsManager

    payload = Caseloads::IndexQuery.call

    render inertia: "Caseloads/Index", props: {
      facilitators: -> { payload.facilitators.map { |employee| Caseloads::FacilitatorSerializer.render(employee) } },
      assignments: -> { payload.assignments.map { |row| Caseloads::AssignmentSerializer.render(row) } },
      clients: -> { payload.clients.map { |client| Caseloads::ClientSerializer.render(client) } },
      unassigned_clients: -> {
        payload.unassigned_clients.map { |client| Caseloads::ClientSerializer.render(client) }
      },
      client_ids_by_facilitator: -> { payload.client_ids_by_facilitator },
      caseload_counts: -> { payload.caseload_counts },
      facilitator_count: -> { payload.facilitator_count },
      clients_on_caseload_count: -> { payload.clients_on_caseload_count },
      unassigned_count: -> { payload.unassigned_count },
    }
  end

  # @route POST /caseloads (caseloads)
  def create
    authorize ClientsManager

    clients_manager.assign_attributes(clients_manager_params)

    if clients_manager.save
      redirect_to caseloads_path, notice: t("templates.controllers.notices.created", model: "Caseload assignment")
    else
      redirect_to caseloads_path, alert: clients_manager.errors.full_messages.to_sentence
    end
  end

  # @route PATCH /caseloads/:id (caseload)
  # @route PUT /caseloads/:id (caseload)
  def update
    authorize clients_manager

    if clients_manager.update(ends_at: Time.current)
      redirect_to caseloads_path, notice: t("templates.controllers.notices.updated", model: "Caseload assignment")
    else
      redirect_to caseloads_path, alert: clients_manager.errors.full_messages.to_sentence
    end
  end
end
