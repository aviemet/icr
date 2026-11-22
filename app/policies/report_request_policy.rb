# frozen_string_literal: true

class ReportRequestPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?
      return scope.none unless job_title_allows?(:index, ReportRequest)

      if job_title_allows?(:index, ReportRequest)
        scope.all
      else
        scope.where(requested_by_id: user.id)
      end
    end
  end

  def index?
    standard_auth(:index)
  end

  def show?
    return true if admin?
    return true if record.requested_by_id == user.id

    standard_auth(:show)
  end

  def create?
    standard_auth(:create)
  end

  def download?
    show?
  end

  def destroy?
    standard_auth(:destroy)
  end
end
