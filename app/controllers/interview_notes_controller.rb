class InterviewNotesController < ApplicationController
  expose :employee_interview, model: Employee::Interview, id: -> { params[:interview_id] },
    scope: -> { policy_scope(Employee::Interview.includes_associated) }
  expose :interview_note, model: Employee::InterviewNote,
    scope: -> { employee_interview.interview_notes }

  strong_params :interview_note, permit: [:note, :recommendation, :employee_id]

  # @route POST /employees/interviews/:interview_id/interview_notes (interview_interview_notes)
  def create
    authorize employee_interview.employee, :update?
    interview_note.assign_attributes(interview_note_params)
    interview_note.interview = employee_interview
    interview_note.employee_id ||= current_user.person&.employee&.id || employee_interview.employee_id
    interview_note.save
    redirect_to interview_path(employee_interview)
  end

  # @route PATCH /employees/interviews/:interview_id/interview_notes/:id (interview_interview_note)
  # @route PUT /employees/interviews/:interview_id/interview_notes/:id (interview_interview_note)
  def update
    authorize employee_interview.employee, :update?
    interview_note.update(interview_note_params)
    redirect_to interview_path(employee_interview)
  end

  # @route DELETE /employees/interviews/:interview_id/interview_notes/:id (interview_interview_note)
  def destroy
    authorize employee_interview.employee, :update?
    interview_note.destroy!
    redirect_to interview_path(employee_interview)
  end
end
