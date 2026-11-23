class Compliance::CorrectiveActionPolicy < ApplicationPolicy
  def update?
    Pundit.policy(user, record.form_submission).update?
  end

  def close?
    update?
  end
end
