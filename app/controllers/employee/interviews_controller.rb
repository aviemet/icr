class Employee::InterviewsController < ApplicationController
  include Searchable
  
  expose :employee_interviews, -> { search(Employee::Interview.includes_associated) }
  expose :employee_interview, scope: ->{ Employee::Interview.includes_associated }
  
  sortable_fields %w(employee_id scheduled_at notes)

  strong_params :employee_interview, permit: [:employee_id, :scheduled_at, :notes]

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

  def show
    authorize employee_interview
    render inertia: "Employee/Interviews/Show", props: {
      employee_interview: -> { employee_interview.render(:show) }
    }
  end

  def new
    authorize Employee::Interview.new
    render inertia: "Employee/Interviews/New", props: {
      employee_interview: Employee::Interview.new.render(:form_data)
    }
  end

  def edit
    authorize employee_interview
    render inertia: "Employee/Interviews/Edit", props: {
      employee_interview: employee_interview.render(:edit)
    }
  end

  def create
    authorize Employee::Interview.new
    if employee_interview.save
      redirect_to employee_interview, notice: "Interview was successfully created."
    else
      redirect_to new_employee_interview_path, inertia: { errors: employee_interview.errors }
    end
  end

  def update
    authorize employee_interview
    if employee_interview.update(employee_interview_params)
      redirect_to employee_interview, notice: "Interview was successfully updated."
    else
      redirect_to edit_employee_interview_path, inertia: { errors: employee_interview.errors }
    end
  end

  def destroy
    authorize employee_interview
    employee_interview.destroy!
    redirect_to employee_interviews_url, notice: "Interview was successfully destroyed."
  end
end
