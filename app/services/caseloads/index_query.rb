class Caseloads::IndexQuery
  Result = Struct.new(
    :facilitators,
    :assignments,
    :clients,
    :unassigned_clients,
    :client_ids_by_facilitator,
    :caseload_counts,
    :facilitator_count,
    :clients_on_caseload_count,
    :unassigned_count,
    keyword_init: true,
  )

  def self.call
    new.call
  end

  def call
    facilitators = load_facilitators
    facilitator_ids = facilitators.map(&:id)
    assignments = load_assignments(facilitator_ids)
    assigned_clients = assignments.map(&:client).uniq
    assigned_client_ids = assigned_clients.map(&:id)
    unassigned_clients = load_unassigned_clients(facilitator_ids)

    client_ids_by_facilitator = facilitator_ids.index_with { [] }
    caseload_counts = facilitator_ids.index_with { 0 }

    assignments.each do |assignment|
      manager_id = assignment.manager_id
      client_ids_by_facilitator[manager_id] << assignment.client_id
      caseload_counts[manager_id] += 1
    end

    Result.new(
      facilitators: facilitators,
      assignments: assignments,
      clients: assigned_clients,
      unassigned_clients: unassigned_clients,
      client_ids_by_facilitator: client_ids_by_facilitator.transform_keys(&:to_s),
      caseload_counts: caseload_counts.transform_keys(&:to_s),
      facilitator_count: facilitators.size,
      clients_on_caseload_count: assigned_client_ids.size,
      unassigned_count: unassigned_clients.size,
    )
  end

  private

  def load_facilitators
    job_title = Employee::JobTitle.find_by(slug: "facilitator")
    return Employee.none if job_title.nil?

    Employee.actively_employed
      .joins(:active_employees_job_title)
      .where(employees_job_titles: { job_title_id: job_title.id })
      .joins(:person)
      .includes(:person)
      .order("people.last_name ASC", "people.first_name ASC")
  end

  def load_assignments(facilitator_ids)
    return ClientsManager.none if facilitator_ids.empty?

    ClientsManager.current
      .where(manager_id: facilitator_ids)
      .includes(client: :person)
      .order(:starts_at)
  end

  def load_unassigned_clients(facilitator_ids)
    assigned_client_ids = if facilitator_ids.empty?
                            []
                          else
                            ClientsManager.current.where(manager_id: facilitator_ids).select(:client_id)
                          end

    active_clients
      .where.not(id: assigned_client_ids)
      .joins(:person)
      .includes(:person)
      .order("people.last_name ASC", "people.first_name ASC")
  end

  def active_clients
    today = Date.current

    Client.where(
      "clients.active_at IS NOT NULL AND (clients.inactive_at IS NULL OR clients.inactive_at > ?)",
      today,
    )
  end
end
