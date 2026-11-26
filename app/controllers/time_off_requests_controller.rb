# frozen_string_literal: true

class TimeOffRequestsController < ApplicationController
  expose :time_off_request, model: TimeOff::Request, scope: -> { policy_scope(TimeOff::Request) }

  strong_params :time_off_request, permit: [
    :employee_id,
    :kind,
    :starts_at,
    :ends_at,
    :hours,
    :review_note,
  ]

  # @route GET /time_off_requests (time_off_requests)
  def index
    authorize TimeOff::Request

    current = current_user.person&.employee
    my_requests = if current
                    policy_scope(TimeOff::Request).where(employee_id: current.id).order(created_at: :desc).limit(50)
                  else
                    TimeOff::Request.none
                  end
    pending_queue = if current
                      policy_scope(TimeOff::Request).pending_for_manager(current).includes_associated.order(:starts_at)
                    else
                      TimeOff::Request.none
                    end
    org_pending = if current && policy(TimeOff::Request).approve? &&
        (current.job_title&.has_role?(:index, TimeOff::Request) || current_user.has_role?(:admin))
                    policy_scope(TimeOff::Request)
                      .pending
                      .where.not(id: pending_queue.select(:id))
                      .includes_associated
                      .order(:starts_at)
                      .limit(100)
                  else
                    TimeOff::Request.none
                  end
    org_wide_leave = current && (
      current.job_title&.has_role?(:index, TimeOff::Request) || current_user.has_role?(:admin)
    )
    managed_employees = if current && org_wide_leave
                          Employee.actively_employed.includes(:person).order(:created_at)
                        elsif current
                          Employee.where(id: current.managed_employees_managers.current.select(:employee_id))
                            .includes(:person)
                            .order(:created_at)
                        else
                          Employee.none
                        end

    render inertia: "TimeOff/Index", props: {
      my_requests: -> { my_requests.render(:index) },
      pending_queue: -> { pending_queue.render(:index) },
      org_pending: -> { org_pending.render(:index) },
      managed_employees: -> { managed_employees.render(:persisted) },
      current_employee_id: -> { current&.id&.to_s },
      can_approve: -> { policy(TimeOff::Request).approve? },
      can_create: -> { policy(TimeOff::Request).create? },
      can_manager_leave: -> {
        policy(TimeOff::Request).create? && managed_employees.any?
      },
    }
  end

  # @route POST /time_off_requests (time_off_requests)
  def create
    authorize TimeOff::Request

    employee = resolve_employee_for_create
    authorize_create_for!(employee)

    begin
      TimeOff::SubmitRequest.call(
        employee: employee,
        kind: time_off_request_params[:kind],
        starts_at: time_off_request_params[:starts_at],
        ends_at: time_off_request_params[:ends_at],
        hours: time_off_request_params[:hours],
      )
      redirect_to time_off_requests_path, notice: t("time_off_requests.created")
    rescue TimeOff::SubmitRequest::Error => e
      redirect_to time_off_requests_path, alert: e.message
    end
  end

  # @route POST /time_off_requests/manager_leave (manager_leave_time_off_requests)
  def manager_leave
    authorize TimeOff::Request, :create?

    employee = Employee.find(time_off_request_params.require(:employee_id))
    authorize_create_for!(employee)
    raise Pundit::NotAuthorizedError unless manages_or_admin?(employee)

    begin
      TimeOff::RecordManagerLeave.call(
        employee: employee,
        kind: time_off_request_params[:kind],
        starts_at: time_off_request_params[:starts_at],
        ends_at: time_off_request_params[:ends_at],
        hours: time_off_request_params[:hours],
        user: current_user,
      )
      redirect_to time_off_requests_path, notice: t("time_off_requests.manager_leave_created")
    rescue TimeOff::RecordManagerLeave::Error => e
      redirect_to time_off_requests_path, alert: e.message
    end
  end

  # @route POST /time_off_requests/:id/approve (approve_time_off_request)
  def approve
    authorize time_off_request, :approve?

    begin
      TimeOff::ApproveRequest.call(
        request: time_off_request,
        review_note: params.dig(:time_off_request, :review_note),
      )
      redirect_to time_off_requests_path, notice: t("time_off_requests.approved")
    rescue TimeOff::ApproveRequest::Error => e
      redirect_to time_off_requests_path, alert: e.message
    end
  end

  # @route POST /time_off_requests/:id/deny (deny_time_off_request)
  def deny
    authorize time_off_request, :deny?

    begin
      TimeOff::DenyRequest.call(
        request: time_off_request,
        review_note: params.dig(:time_off_request, :review_note),
      )
      redirect_to time_off_requests_path, notice: t("time_off_requests.denied")
    rescue TimeOff::DenyRequest::Error => e
      redirect_to time_off_requests_path, alert: e.message
    end
  end

  # @route POST /time_off_requests/:id/cancel (cancel_time_off_request)
  def cancel
    authorize time_off_request, :cancel?

    begin
      TimeOff::CancelRequest.call(request: time_off_request)
      redirect_to time_off_requests_path, notice: t("time_off_requests.canceled")
    rescue TimeOff::CancelRequest::Error => e
      redirect_to time_off_requests_path, alert: e.message
    end
  end

  private

  def resolve_employee_for_create
    if time_off_request_params[:employee_id].present?
      Employee.find(time_off_request_params[:employee_id])
    else
      current_user.person.employee
    end
  end

  def authorize_create_for!(employee)
    unless TimeOff::RequestPolicy.new(current_user, TimeOff::Request).create_for_employee?(employee)
      raise Pundit::NotAuthorizedError
    end
  end

  def manages_or_admin?(employee)
    return true if current_user.has_role?(:admin)

    current = current_user.person&.employee
    return false unless current

    current.managed_employees_managers.current.exists?(employee: employee) ||
      current.job_title&.has_role?(:index, TimeOff::Request)
  end
end
