# frozen_string_literal: true

module TimeOff
  class RequestPolicy < ApplicationPolicy
    class Scope < ApplicationPolicy::Scope
      def resolve
        return scope.all if admin?
        return scope.none unless employee

        if job_title_allows?(:index, TimeOff::Request)
          scope.all
        else
          managed_ids = employee.managed_employees_managers.current.select(:employee_id)
          scope.where(employee_id: employee.id).or(scope.where(employee_id: managed_ids))
        end
      end
    end

    def index?
      return true if admin?
      return false unless user.person&.employee?

      job_title_allows?(:index, TimeOff::Request) ||
        job_title_allows?(:show, TimeOff::Request) ||
        job_title_allows?(:approve, TimeOff::Request)
    end

    def show?
      return true if admin?
      return false unless user.person&.employee?
      return true if own_request?
      return true if manages_employee?(record.employee) && job_title_allows?(:show, TimeOff::Request)

      job_title_allows?(:index, TimeOff::Request) && job_title_allows?(:show, TimeOff::Request)
    end

    def create?
      return true if admin?
      return false unless user.person&.employee?

      job_title_allows?(:create, TimeOff::Request)
    end

    def update?
      return true if admin?
      return false unless user.person&.employee?
      return false unless job_title_allows?(:update, TimeOff::Request)
      return true if own_request? && record.pending?

      manages_employee?(record.employee)
    end

    def destroy?
      false
    end

    def approve?
      return true if admin?
      return false unless user.person&.employee?
      return false unless job_title_allows?(:approve, TimeOff::Request)
      return true if job_title_allows?(:index, TimeOff::Request)

      primary_manager_of?(record.employee)
    end

    def deny?
      approve?
    end

    def cancel?
      return true if admin?
      return false unless user.person&.employee?
      return true if own_request? && record.pending? && job_title_allows?(:update, TimeOff::Request)

      false
    end

    def create_for_employee?(target_employee)
      return true if admin?
      return false unless user.person&.employee?
      return false unless job_title_allows?(:create, TimeOff::Request)
      return true if target_employee.id == current_employee.id
      return true if job_title_allows?(:index, TimeOff::Request)

      manages_employee?(target_employee)
    end

    private

    def own_request?
      record.employee_id == current_employee&.id
    end

    def primary_manager_of?(employee_record)
      return false unless current_employee

      employee_record.primary_manager_assignment&.manager_id == current_employee.id
    end
  end
end
