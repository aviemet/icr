class ClientPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      # Super admins and admins can see all clients
      return scope.all if user.has_role?(:super_admin) || user.has_role?(:admin)

      case user.person&.role_type
      when "Employee"
        if user.person.employee.job_title && user.has_role?(:index, user.person.employee.job_title)
          scope.all
        elsif user.has_role?(:index, :employee)
          scope.all
        else
          scope.none
        end

      when "Doctor"
        if user.has_role?(:index, :doctor)
          scope.joins(:doctors_clients).where(doctors_clients: { doctor_id: user.person.doctor.id })
        else
          scope.none
        end

      when "Client"
        if user.has_role?(:index, :client)
          scope.where(id: user.person.client.id)
        else
          scope.none
        end

      when "Vendor"
        scope.none
      else
        scope.none
      end
    end
  end
end
