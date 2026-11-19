class Calendar::EventPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?

      case user.person&.agency_role
      when "Employee"
        if job_title_allows?(:index, Calendar::Event)
          scope.all
        else
          employee_id = employee.id
          shift_sql = scope.joins(:shift).where(shifts: { employee_id: employee_id }).select(:id).to_sql
          participant_sql = scope.joins(:event_participants)
            .joins("INNER JOIN clients_attendants ON event_participants.participant_id = clients_attendants.client_id")
            .where(event_participants: { participant_type: "Client" })
            .where(clients_attendants: { attendant_id: employee_id })
            .where("clients_attendants.starts_at <= ? AND (clients_attendants.ends_at IS NULL OR clients_attendants.ends_at >= ?)", Time.current, Time.current)
            .select(:id)
            .to_sql

          scope.where("calendar_events.id IN (#{shift_sql} UNION #{participant_sql})")
        end
      when "Client"
        scope.joins(:event_participants)
          .where(event_participants: { participant_id: user.person.client.id, participant_type: "Client" })
          .distinct
      else
        scope.none
      end
    end
  end

  def index?
    return true if admin?
    return false unless user.person

    case user.person.agency_role
    when "Employee"
      return true if job_title_allows?(:index, Calendar::Event)

      current_employee.present?
    when "Client"
      user.person.client.present?
    else
      false
    end
  end

  def show?
    return true if admin?
    return false unless user.person

    case user.person.agency_role
    when "Employee"
      return true if job_title_allows?(:show, Calendar::Event)
      return true if own_shift?
      return true if attended_client_participant?

      false
    when "Client"
      client_participant?
    else
      false
    end
  end

  private


  def own_shift?
    record.shift&.employee_id == current_employee&.id
  end

  def attended_client_participant?
    return false unless current_employee

    client_ids = record.event_participants.where(participant_type: "Client").select(:participant_id)
    ClientsAttendant.current.exists?(attendant: current_employee, client_id: client_ids)
  end

  def client_participant?
    return false unless user.person&.client

    record.event_participants.exists?(
      participant_type: "Client",
      participant_id: user.person.client.id,
    )
  end
end
