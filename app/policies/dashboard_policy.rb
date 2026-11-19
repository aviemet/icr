class DashboardPolicy < ApplicationPolicy
  def show?
    user.present? && user.person.present?
  end
end
