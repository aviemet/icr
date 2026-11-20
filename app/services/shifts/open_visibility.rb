# frozen_string_literal: true

class Shifts::OpenVisibility
  def self.can_view?(user, client = nil)
    new(user).can_view?(client)
  end

  def self.future_open_shifts_for(user)
    new(user).future_open_shifts
  end

  def self.future_open_count_for_client(user, client)
    new(user).future_open_count_for_client(client)
  end

  def initialize(user)
    @user = user
  end

  def can_view?(client = nil)
    return false if user.blank?
    return true if admin?
    return false if current_employee.blank?
    return true if client.present? && manages_client?(client)

    client.nil? && managed_client_ids.any?
  end

  def future_open_shifts
    return Shift.none unless can_view_any?

    Shift.open
      .future
      .where(id: visible_future_open_ids)
      .includes(calendar_event: { clients: :person })
      .joins(:calendar_event)
      .order("calendar_events.starts_at ASC")
  end

  def future_open_count
    return 0 unless can_view_any?

    visible_future_open_ids.size
  end

  def future_open_count_for_client(client)
    return 0 unless can_view?(client)

    Shift.open
      .future
      .joins(calendar_event: :event_participants)
      .where(
        event_participants: {
          participant_type: "Client",
          participant_id: client.id,
        },
      )
      .distinct
      .pluck(:id)
      .size
  end

  private

  attr_reader :user

  def can_view_any?
    return false if user.blank?
    return true if admin?

    managed_client_ids.any?
  end

  def admin?
    user.has_role?(:admin)
  end

  def current_employee
    user.person&.employee
  end

  def manages_client?(client)
    return false unless current_employee
    return false unless client.is_a?(Client)

    client.clients_managers.current.exists?(manager: current_employee)
  end

  def managed_client_ids
    return [] unless current_employee

    @managed_client_ids ||= ClientsManager.current
      .where(manager: current_employee)
      .pluck(:client_id)
  end

  def visible_future_open_ids
    return @visible_future_open_ids if defined?(@visible_future_open_ids)

    scope = Shift.open.future
    unless admin?
      scope = scope
        .joins(calendar_event: :event_participants)
        .where(
          event_participants: {
            participant_type: "Client",
            participant_id: managed_client_ids,
          },
        )
    end

    @visible_future_open_ids = scope.distinct.pluck(:id)
  end
end
