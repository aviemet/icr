class PayrollPolicy < ApplicationPolicy

  class Scope < ApplicationPolicy::Scope
  end

  def index?
    standard_auth(:index)
  end

  def show?
    standard_auth(:show)
  end

  def create?
    standard_auth(:create)
  end

  def new?
    create?
  end

  def edit?
    standard_auth(:update)
  end

  def update?
    edit?
  end

  def destroy?
    standard_auth(:destroy)
  end
end
