class Calendar::EventPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, Calendar::Event)
          scope.all
        else
          employee_id = user.person.employee.id
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
end
