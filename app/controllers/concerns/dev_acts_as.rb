# frozen_string_literal: true

module DevActsAs
  extend ActiveSupport::Concern

  SESSION_KEY = :acts_as_user_id
  CACHE_KEY_PREFIX = "user_permissions"

  class << self
    def enabled?
      Rails.env.development?
    end
  end

  def true_user
    @true_user ||= warden.authenticate(scope: :user)
  end

  def current_user
    if self.class.acts_as_override_active? && acting_user.present?
      return acting_user
    end

    true_user
  end

  def acting_as?
    self.class.acts_as_override_active? && acting_user.present? && acting_user.id != true_user&.id
  end

  def user_for_paper_trail
    true_user&.id
  end

  def start_acts_as!(user)
    return unless self.class.acts_as_override_active?
    return if user.nil? || true_user.nil?

    bust_permissions_cache(true_user.id)
    bust_permissions_cache(user.id)
    session[SESSION_KEY] = user.id
    clear_acting_user_memo!
  end

  def stop_acts_as!
    previous_id = session[SESSION_KEY]
    if self.class.acts_as_override_active?
      bust_permissions_cache(true_user&.id)
      bust_permissions_cache(previous_id)
    end
    session.delete(SESSION_KEY)
    clear_acting_user_memo!
  end

  class_methods do
    def acts_as_override_active?
      DevActsAs.enabled?
    end
  end

  private

  def acting_user
    return @acting_user if defined?(@acting_user)

    user_id = session[SESSION_KEY]
    @acting_user = user_id.present? ? User.find_by(id: user_id) : nil
    session.delete(SESSION_KEY) if user_id.present? && @acting_user.nil?
    @acting_user
  end

  def clear_acting_user_memo!
    remove_instance_variable(:@acting_user) if defined?(@acting_user)
  end

  def bust_permissions_cache(user_id)
    return if user_id.blank?

    Rails.cache.delete("#{CACHE_KEY_PREFIX}/#{user_id}")
  end
end
