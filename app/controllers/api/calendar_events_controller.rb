class Api::CalendarEventsController < Api::ApiController
  expose :calendar_events, -> { policy_scope(Calendar::Event) }
  expose :calendar_event, model: Calendar::Event, scope: -> { policy_scope(Calendar::Event) }

  before_action :resolve_category_slug, only: [:create, :update]
  before_action :resolve_shift_service_type, only: [:create, :update]
  before_action :enforce_service_type_rules, only: [:create, :update]

  strong_params :calendar_event, permit: [
    :name,
    :starts_at,
    :ends_at,
    :parent_id,
    :category_id,
    :all_day,
    :notes,
    shift_attributes: [:employee_id, :service_type_id, :mileage],
    event_participants_attributes: [:participant_id, :participant_type],
    recurring_patterns_attributes: [
      :recurring_type,
      :offset,
      :day_of_week,
      :day_of_month,
      :week_of_month,
      :month_of_year,
      :end_date,
      :max_occurrences,
    ],
  ]

  # @route POST /api/calendar_events (api_calendar_events)
  def create
    authorize Calendar::Event.new

    if calendar_event.save
      render json: calendar_event.render, status: :created
    else
      render json: { errors: calendar_event_error_messages }, status: :unprocessable_content
    end
  end

  # @route PATCH /api/calendar_events/:id (api_calendar_event)
  # @route PUT /api/calendar_events/:id (api_calendar_event)
  def update
    authorize calendar_event

    edit_scope = params.dig(:calendar_event, :edit_scope).presence || "all"
    occurrence_starts_at = params.dig(:calendar_event, :occurrence_starts_at)

    begin
      Calendar::Recurring::ApplyOccurrenceEdit.call(
        calendar_event,
        attrs: calendar_event_params.to_h.deep_symbolize_keys,
        edit_scope: edit_scope,
        occurrence_starts_at: occurrence_starts_at,
      )
      render json: calendar_event.reload.render, status: :created
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.to_hash(true).transform_values { |messages| messages.first.to_s } },
        status: :unprocessable_content
    rescue ArgumentError => e
      render json: { errors: { base: e.message } }, status: :unprocessable_content
    end
  end

  # @route DELETE /api/calendar_events/:id (api_calendar_event)
  def destroy
    authorize calendar_event

    edit_scope = params[:edit_scope].presence || "all"
    occurrence_starts_at = params[:occurrence_starts_at]

    if edit_scope.to_s == "one" && calendar_event.recurring_patterns.any? && occurrence_starts_at.present?
      Calendar::Recurring::CancelOccurrence.call(calendar_event, occurrence_starts_at: occurrence_starts_at)
      head :no_content
      return
    end

    if edit_scope.to_s == "future" && calendar_event.recurring_patterns.any? && occurrence_starts_at.present?
      begin
        result = Calendar::Recurring::EndSeriesFrom.call(
          calendar_event,
          occurrence_starts_at: occurrence_starts_at,
        )
      rescue ArgumentError => e
        render json: { errors: { base: e.message } }, status: :unprocessable_content
        return
      end

      if result == :truncated
        head :no_content
        return
      end
    end

    if calendar_event.destroy
      head :no_content
    else
      render json: { errors: calendar_event.errors }, status: :unprocessable_content
    end
  end

  private

  def calendar_event_error_messages
    calendar_event.errors.to_hash(true).transform_values { |messages| messages.first.to_s }
  end

  # rubocop:disable-next Rails/StrongParametersExpect
  def resolve_category_slug
    slug = params.dig(:calendar_event, :category_slug)
    if slug.present?
      params[:calendar_event][:category_id] = Category.type("Calendar::Event").find_by!(slug: slug).id
      params[:calendar_event].delete(:category_slug)
      return
    end

    id_or_slug = params.dig(:calendar_event, :category_id)
    return if id_or_slug.blank?

    category = Category.find_by(id: id_or_slug) || Category.find_by!(slug: id_or_slug)
    params[:calendar_event][:category_id] = category.id
  end

  def resolve_shift_service_type
    shift_params = params.dig(:calendar_event, :shift_attributes)
    shift_params = params.dig(:calendar_event, :shift) if shift_params.blank?
    return if shift_params.blank?

    id_or_slug = shift_params[:service_type_id].presence ||
      shift_params[:service_type_slug].presence ||
      shift_params[:category_id].presence ||
      shift_params[:category_slug].presence
    return if id_or_slug.blank?

    service_type = ServiceType.active.assignable.find_by(id: id_or_slug) ||
      ServiceType.active.assignable.find_by(slug: id_or_slug)
    if service_type.blank?
      render json: { errors: { service_type_id: I18n.t("service_types.errors.not_assignable") } },
        status: :unprocessable_content
      return
    end

    shift_params[:service_type_id] = service_type.id
    shift_params.delete(:service_type_slug)
    shift_params.delete(:category_id)
    shift_params.delete(:category_slug)
  end

  def enforce_service_type_rules
    shift_params = params.dig(:calendar_event, :shift_attributes)
    shift_params = params.dig(:calendar_event, :shift) if shift_params.blank?
    return if shift_params.blank?

    service_type_id = shift_params[:service_type_id]
    return if service_type_id.blank?

    service_type = ServiceType.active.assignable.find_by(id: service_type_id)
    if service_type.blank?
      render json: { errors: { service_type_id: I18n.t("service_types.errors.not_assignable") } },
        status: :unprocessable_content
      return
    end

    participants = Array(params.dig(:calendar_event, :event_participants_attributes))
    client_count = participants.count { |row| row[:participant_type].to_s == "Client" && row[:participant_id].present? }

    if !service_type.allows_multi_client? && client_count > 1
      render json: { errors: { base: I18n.t("service_types.errors.multi_client_not_allowed") } },
        status: :unprocessable_content
      return
    end

    notes = params.dig(:calendar_event, :notes).to_s.strip
    if service_type.requires_notes? && notes.blank?
      render json: { errors: { notes: I18n.t("service_types.errors.notes_required") } },
        status: :unprocessable_content
    end
  end
end
