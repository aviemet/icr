class HouseholdsController < ApplicationController
  include Searchable

  expose :households, -> { policy_scope(search(Household.includes_associated)) }
  expose :household, id: -> { params[:slug] }, scope: -> { policy_scope(Household.includes_associated) }, find_by: :slug

  sortable_fields %w(name)

  strong_params :household, permit: [
    :name,
    contact_attributes: [
      :id,
      addresses_attributes: [
        :id, :name, :address, :address_2, :city, :region, :postal, :country, :notes, :category_id, :_destroy,
      ],
      phones_attributes: [
        :id, :name, :number, :extension, :notes, :category_id, :_destroy,
      ],
      emails_attributes: [
        :id, :name, :email, :notes, :category_id, :_destroy,
      ],
    ],
  ]

  # @route GET /households (households)
  def index
    authorize Household

    paginated_households = paginate(households, :households)

    render inertia: "Households/Index", props: {
      households: -> { paginated_households.render(:index) },
      pagination: -> { {
        count: households.count,
        **pagination_data(paginated_households)
      } }
    }
  end

  # @route GET /households/:slug (household)
  def show
    authorize household

    household_for_show = Household.includes_show.find(household.id)

    render inertia: "Households/Show", props: {
      household: -> { household_for_show.render(:show) },
      can_update: -> { policy(household).update? },
      available_clients: -> {
        return [] unless policy(household).update?

        Client
          .joins(:person)
          .includes(:person)
          .where.not(id: HouseholdsClient.current.select(:client_id))
          .order("people.last_name ASC", "people.first_name ASC")
          .render(:options)
      },
    }
  end

  # @route GET /households/new (new_household)
  def new
    authorize Household.new
    render inertia: "Households/New", props: {
      household: Household.new.render(:form_data)
    }
  end

  # @route GET /households/:slug/edit (edit_household)
  def edit
    authorize household
    render inertia: "Households/Edit", props: {
      household: household.render(:edit)
    }
  end

  # @route GET /households/:slug/schedule (schedule_household)
  def schedule
    authorize household

    household_for_show = Household.includes_show.find(household.id)
    range_start, range_end = DateRangeCalculator.new(params).call

    render inertia: "Households/Schedule", props: {
      household: -> { household_for_show.render(:show) },
      schedules: -> {
        Households::RenderSchedule.call(
          household: household,
          range_start: range_start,
          range_end: range_end,
        )
      },
    }
  end

  # @route POST /households (households)
  def create
    authorize Household.new
    household.assign_attributes(household_params)
    if household.save
      redirect_to household, notice: t("templates.controllers.notices.created", model: "Household")
    else
      redirect_to new_household_path, inertia: { errors: household.errors }
    end
  end

  # @route PATCH /households/:slug (household)
  # @route PUT /households/:slug (household)
  def update
    authorize household
    if household.update(household_params)
      redirect_to household_path(household, tab: params[:tab].presence || "profile"),
        notice: t("templates.controllers.notices.updated", model: "Household")
    else
      redirect_back_or_to edit_household_path(household), inertia: { errors: household.errors }
    end
  end

  # @route DELETE /households/:slug (household)
  def destroy
    authorize household
    household.destroy!
    redirect_to households_url, notice: t("templates.controllers.notices.destroyed", model: "Household")
  end
end
