class EmployeesController < ApplicationController
  include Searchable

  STATUS_EVENTS = %w[
    make_offer
    begin_employment
    close_application
    accept_offer
    reject_offer
    terminate
    reconsider
  ].freeze

  expose :employees, -> { search(Employee.includes_associated.left_joins(:person)) }
  expose :employee, id: -> { params[:slug] }, find_by: :slug, scope: -> { Employee.includes_associated }

  sortable_fields %w(active_at inactive_at number status people.first_name people.last_name)

  filterable_fields :number, :active_at, :created_at,
    first_name: { column: "people.first_name" },
    last_name: { column: "people.last_name" },
    job_title: { column: "job_titles.name", joins: :job_title },
    job_titles: { column: "job_titles.name", joins: :job_title, type: :in },
    statuses: {
      column: :status,
      type: :in,
      values: -> { Employee.statuses.keys },
      default: "employed",
    }

  strong_params :employee, permit: [
    :person_id, :active_at, :inactive_at, :number, :status, :color,
    :preferred_language, :communication_notes, :eligible_for_hire,
    :ineligibility_reason, :termination_reason, :job_title_id,
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
    authorize employees

    paginated_employees = paginate(employees, :employees)

    render inertia: "Employees/Index", props: {
      employees: -> { paginated_employees.render(:index) },
      pagination: -> { {
        count: employees.count,
        **pagination_data(paginated_employees)
      } },
      job_title_options: -> { Employee::JobTitle.order(:name).distinct.pluck(:name) },
    }
  end

  # @route GET /employees/:slug (employee)
  def show
    authorize employee

    employee_for_show = Employee.includes_show.find(employee.id)

    render inertia: "Employees/Show", props: {
      employee: -> { employee_for_show.render(:show) },
      training_options: -> { Employee::Training.order(:name).render(:options) },
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

    schedules = employee.schedule_events_between(*DateRangeCalculator.new(params).call)

    render inertia: "Employees/Schedule", props: {
      employee: -> { employee.render(:show) },
      schedules: lambda {
        schedules.render(:employee)
      },
    }
  end

  # @route GET /employees/:slug/status (status_employee)
  def status
    authorize employee, :show?

    employee_for_show = Employee.includes_show.find(employee.id)

    render inertia: "Employees/Status", props: {
      employee: -> { employee_for_show.render(:show) },
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

    unless employee.aasm.may_fire_event?(event.to_sym)
      redirect_to status_employee_path(employee), inertia: { errors: { event: ["cannot transition"] } }
      return
    end

    employee.assign_attributes(employee_status_params.except(:event))

    if employee.public_send(:"#{event}!")
      redirect_to employee_path(employee), notice: t("templates.controllers.notices.status_updated", model: "Employee")
    else
      render inertia: "Employees/Status", props: {
        employee: employee.render(:show),
        errors: employee.errors
      }
    end
  rescue AASM::InvalidTransition
    redirect_to status_employee_path(employee), inertia: { errors: { event: ["cannot transition"] } }
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
end
