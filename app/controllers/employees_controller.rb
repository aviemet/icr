class EmployeesController < ApplicationController
  include Searchable

  WORKFORCE_STATUSES = %w[employed terminated].freeze
  PIPELINE_STATUSES = %w[applicant offered declined withdrawn].freeze
  WORKFORCE_VIEWS = %w[employed terminated all].freeze

  STATUS_EVENTS = %w[
    make_offer
    begin_employment
    withdraw_application
    decline_application
    accept_offer
    reject_offer
    terminate
    reconsider
  ].freeze

  expose :employees, -> { workforce_employees }
  expose :employee,
    id: -> { params[:slug] },
    find_by: :slug,
    scope: -> { policy_scope(Employee.includes_associated) },
    build_params: -> { employee_params.except(:job_title_id) }

  sortable_fields %w(active_at inactive_at number status people.first_name people.last_name)

  filterable_fields :number, :created_at,
    active_at: { type: :date_range },
    first_name: { column: "people.first_name" },
    last_name: { column: "people.last_name" },
    job_title: { column: "job_titles.name", joins: :job_title },
    job_titles: { column: "job_titles.name", joins: :job_title, type: :in }

  strong_params :employee, permit: [
    :person_id, :active_at, :inactive_at, :number, :status, :color,
    :preferred_language, :communication_notes, :eligible_for_hire,
    :ineligibility_reason, :termination_reason, :job_title_id,
    :application_source, :desired_compensation, :desired_compensation_cents,
    :desired_compensation_currency, :desired_compensation_period,
    :desired_job_title_id, :hiring_notes, :resume, :cover_letter,
    :overtime_policy,
    person_attributes: [
      :id, :first_name, :middle_name, :last_name, :nick_name, :dob,
      contact_attributes: [
        :id,
        addresses_attributes: [
          :id, :name, :address, :address_2, :city, :region, :postal, :country, :notes, :category_id, :_destroy,
        ],
        phones_attributes: [
          :id, :name, :number, :extension, :notes, :category_id, :_destroy,
        ],
        emails_attributes: [
          :id, :name, :email, :notes, :category_id, :_destroy,
        ],
      ],
    ],
  ]

  # @route GET /employees (employees)
  def index
    authorize Employee

    paginated_employees = paginate(employees, :employees)
    page_employees = paginated_employees.to_a

    render inertia: "Employees/Index", props: {
      employees: -> { page_employees.map { |record| record.render(:index) } },
      can_updates: -> {
        page_employees.to_h { |record| [record.id, policy(record).update?] }
      },
      pagination: -> { {
        count: employees.count,
        **pagination_data(paginated_employees)
      } },
      job_title_options: -> { Employee::JobTitle.order(:name).distinct.pluck(:name) },
      can_scope_employees: -> { can_scope_employees? },
      workforce_view: -> { workforce_view_param },
    }
  end

  # @route GET /employees/:slug (employee)
  def show
    authorize employee

    employee_for_show = Employee.includes_show.find(employee.id)
    requirement_fulfillments = Requirement::FulfillmentForEmployee.call(employee_for_show)

    render inertia: "Employees/Show", props: {
      employee: -> { employee_for_show.render(:show) },
      can_update: -> { policy(employee).update? },
      training_options: -> {
        assigned_ids = employee_for_show.employees_trainings.map(&:training_id)
        Employee::Training.active.where.not(id: assigned_ids).order(:name).render(:options)
      },
      can_complete_trainings: -> { Employee::TrainingPolicy.new(current_user, Employee::Training).complete? },
      requirement_fulfillments: -> { requirement_fulfillments.to_h },
    }
  end

  # @route GET /employees/new (new_employee)
  def new
    authorize Employee.new

    render inertia: "Employees/New", props: {
      employee: Employee.new.render(:form_data)
    }
  end

  # @route GET /employees/:slug/edit (edit_employee)
  def edit
    authorize employee

    render inertia: "Employees/Edit", props: {
      employee: employee.render(:edit)
    }
  end

  # @route GET /employees/:slug/schedule (schedule_employee)
  def schedule
    authorize employee

    range_start, range_end = DateRangeCalculator.new(params).call
    masters = employee.schedule_events_between(range_start, range_end)

    render inertia: "Employees/Schedule", props: {
      employee: -> { employee.render(:show) },
      can_update: -> { policy(employee).update? },
      schedules: lambda {
        Calendar::RenderSchedule.call(
          events: masters,
          range_start: range_start,
          range_end: range_end,
          view: :employee,
        )
      },
    }
  end

  # @route GET /employees/:slug/status (status_employee)
  def status
    authorize employee, :update?

    employee_for_show = Employee.includes_show.find(employee.id)

    render inertia: "Employees/Status", props: {
      employee: -> { employee_for_show.render(:show) },
      can_update: -> { true },
    }
  end

  # @route PUT /employees/:slug/status (status_employee)
  def update_status
    authorize employee, :update?

    event = employee_status_params[:event].to_s
    unless STATUS_EVENTS.include?(event)
      redirect_to status_employee_path(employee), alert: t("templates.controllers.notices.status_updated", model: "Employee")
      return
    end

    if event == "terminate"
      Employee::Offboard.call(
        employee: employee,
        attrs: employee_status_params.except(:event, :terminate_immediately),
        terminate_immediately: employee_status_params[:terminate_immediately],
      )
      redirect_to employee_path(employee), notice: t("templates.controllers.notices.status_updated", model: "Employee")
      return
    end

    unless employee.aasm.may_fire_event?(event.to_sym)
      employment_errors = employment_gate_errors_for(employee, event)
      redirect_to status_employee_path(employee), inertia: {
        errors: employment_errors.presence || { event: ["cannot transition"] },
      }
      return
    end

    employee.assign_attributes(employee_status_params.except(:event, :terminate_immediately, :inactive_at_time))

    if employee.public_send(:"#{event}!")
      redirect_to employee_path(employee), notice: t("templates.controllers.notices.status_updated", model: "Employee")
    else
      render inertia: "Employees/Status", props: {
        employee: employee.render(:show),
        errors: employee.errors
      }
    end
  rescue ArgumentError => e
    redirect_to status_employee_path(employee), inertia: { errors: { base: [e.message] } }
  rescue AASM::InvalidTransition
    employment_errors = employment_gate_errors_for(employee, event)
    redirect_to status_employee_path(employee), inertia: {
      errors: employment_errors.presence || { event: ["cannot transition"] },
    }
  end

  # @route DELETE /employees/:slug/pending_termination (pending_termination_employee)
  def destroy_pending_termination
    authorize employee, :update?

    Employee::CancelPendingTermination.call(employee: employee)
    redirect_back_or_to root_path, notice: t("templates.controllers.notices.status_updated", model: "Employee")
  rescue ArgumentError => e
    redirect_back_or_to employee_path(employee), alert: e.message
  end

  # @route POST /employees (employees)
  def create
    authorize Employee.new
    attrs = employee_params
    job_title_id = attrs.delete(:job_title_id)
    employee.assign_attributes(attrs)
    if employee.save
      assign_job_title_from_param(employee, job_title_id)
      redirect_to employee_path(employee), notice: t("templates.controllers.notices.created", model: "Employee")
    else
      redirect_to new_employee_path, inertia: { errors: employee.errors }
    end
  end

  # @route PATCH /employees/:slug (employee)
  # @route PUT /employees/:slug (employee)
  def update
    authorize employee

    attrs = employee_params
    job_title_id = attrs.delete(:job_title_id)

    if employee.update(attrs)
      assign_job_title_from_param(employee, job_title_id)
      redirect_to employee_path(employee, tab: params[:tab].presence || "profile"),
        notice: t("templates.controllers.notices.updated", model: "Employee")
    else
      redirect_back_or_to edit_employee_path(employee), inertia: { errors: employee.errors }
    end
  end

  # @route DELETE /employees/:slug (employee)
  def destroy
    authorize employee

    employee.destroy!
    redirect_to employees_url, notice: t("templates.controllers.notices.destroyed", model: "Employee")
  end

  private

  def employee_status_params
    params.expect(
      employee: [:event,
                 :active_at,
                 :inactive_at,
                 :inactive_at_time,
                 :terminate_immediately,
                 :termination_reason,
                 :ineligibility_reason,
                 :eligible_for_hire],
    )
  end

  def assign_job_title_from_param(record, job_title_id)
    return if job_title_id.blank?

    job_title = Employee::JobTitle.find_by(id: job_title_id)
    record.assign_job_title(job_title) if job_title
  end

  def workforce_employees
    relation = policy_scope(Employee.includes_associated.left_joins(:person))
    relation = case workforce_view_param
               when "all"
                 relation
               when "terminated"
                 relation.where(status: :terminated)
               else
                 relation.where(status: :employed)
               end
    search(relation)
  end

  def workforce_view_param
    return "employed" unless can_scope_employees?

    view = params[:workforce_view].to_s
    return view if WORKFORCE_VIEWS.include?(view)

    "employed"
  end

  def can_scope_employees?
    current_user&.has_role?(:admin)
  end

  def employment_gate_errors_for(record, event)
    return unless %w[begin_employment accept_offer].include?(event.to_s)

    gate = Requirement::EmploymentGate.call(record)
    return if gate.allowed?

    {
      base: [
        I18n.t(
          "requirements.gates.employment_blocked",
          names: gate.unmet_names.to_sentence,
        ),
      ],
    }
  end
end
