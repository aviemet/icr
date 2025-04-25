class InterviewsController < ApplicationController
  include Searchable

  expose :employee_interviews, -> { search(policy_scope(Employee::Interview.includes_associated)) }
  expose :employee_interview, scope: ->{ policy_scope(Employee::Interview.includes_associated) }

  sortable_fields %w(employee_id scheduled_at notes)

  strong_params :employee_interview, permit: [:employee_id, :scheduled_at, :notes]

  # @route GET /employees/interviews (interviews)
  def index
    authorize employee_interviews

    paginated_employee_interviews = paginate(employee_interviews, :employee_interviews)

    render inertia: "Employee/Interviews/Index", props: {
      employee_interviews: -> { paginated_employee_interviews.render(:index) },
      pagination: -> { {
        count: employee_interviews.size,
        **pagination_data(paginated_employee_interviews)
      } },
    }
  end

  # @route GET /employees/interviews/:id (interview)
  def show
    authorize employee_interview

    render inertia: "Employee/Interviews/Show", props: {
      employee_interview: -> { employee_interview.render(:show) }
    }
  end

  # @route GET /employees/interviews/new (new_interview)
  def new
    authorize Employee::Interview.new

    render inertia: "Employee/Interviews/New", props: {
      employee_interview: Employee::Interview.new.render(:form_data)
    }
  end

  # @route GET /employees/interviews/:id/edit (edit_interview)
  def edit
    authorize employee_interview

    render inertia: "Employee/Interviews/Edit", props: {
      employee_interview: employee_interview.render(:edit)
    }
  end

  # @route POST /employees/interviews (interviews)
  def create
    authorize Employee::Interview.new

    if employee_interview.save
      redirect_to employee_interview, notice: t("templates.controllers.notices.created", model: "Interview")
    else
      redirect_to new_employee_interview_path, inertia: { errors: employee_interview.errors }
    end
  end

  # @route PATCH /employees/interviews/:id (interview)
  # @route PUT /employees/interviews/:id (interview)
  def update
    authorize employee_interview

    if employee_interview.update(employee_interview_params)
      redirect_to employee_interview, notice: t("templates.controllers.notices.updated", model: "Interview")
    else
      redirect_to edit_employee_interview_path, inertia: { errors: employee_interview.errors }
    end
  end

  # @route DELETE /employees/interviews/:id (interview)
  def destroy
    authorize employee_interview

    employee_interview.destroy!
    redirect_to employee_interviews_url, notice: t("templates.controllers.notices.destroyed", model: "Interview")
  end
end
