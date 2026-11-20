class ApplicantsController < ApplicationController
  include Searchable

  PIPELINE_STATUSES = Employee::PIPELINE_STATUSES
  DEFAULT_STATUSES = %w[applicant offered].freeze

  expose :employees, -> { pipeline_employees }

  sortable_fields %w(active_at inactive_at number status people.first_name people.last_name)

  filterable_fields :number, :created_at,
    active_at: { type: :date_range },
    first_name: { column: "people.first_name" },
    last_name: { column: "people.last_name" },
    job_title: { column: "job_titles.name", joins: :job_title },
    job_titles: { column: "job_titles.name", joins: :job_title, type: :in },
    statuses: {
      column: :status,
      type: :in,
      values: -> { PIPELINE_STATUSES },
      default: DEFAULT_STATUSES,
    }

  # @route GET /employees/applicants (applicants)
  def index
    authorize Employee, :index?

    paginated_employees = paginate(employees, :employees)
    page_employees = paginated_employees.to_a

    render inertia: "Applicants/Index", props: {
      employees: -> { page_employees.map { |record| record.render(:index) } },
      can_updates: -> {
        page_employees.to_h { |record| [record.id, policy(record).update?] }
      },
      pagination: -> { {
        count: employees.count,
        **pagination_data(paginated_employees)
      } },
      job_title_options: -> { Employee::JobTitle.order(:name).distinct.pluck(:name) },
    }
  end

  private

  def pipeline_employees
    relation = policy_scope(Employee.includes_associated.left_joins(:person)).pipeline
    unless params.key?(:statuses) || params.key?("statuses")
      relation = relation.where(status: DEFAULT_STATUSES)
    end
    search(relation)
  end
end
