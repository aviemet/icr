class HouseholdsController < ApplicationController
  include Searchable

  expose :households, -> { search(Household.includes_associated) }
  expose :household, scope: ->{ Household }, find: ->(id, scope){ scope.includes_associated.find(id) }

  sortable_fields %w(householdable_id householdable_type type number notes issued_at expires_at extra_fields)

  strong_params :household, permit: [:householdable_id, :householdable_type, :type, :number, :notes, :issued_at, :expires_at, :extra_fields]

  # @route GET /households (households)
  def index
    authorize households

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
    render inertia: "Households/Show", props: {
      household: -> { household.render(:show) }
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

  # @route POST /households (households)
  def create
    authorize Household.new
    if household.save
      redirect_to household, notice: "Household was successfully created."
    else
      redirect_to new_household_path, inertia: { errors: household.errors }
    end
  end

  # @route PATCH /households/:slug (household)
  # @route PUT /households/:slug (household)
  def update
    authorize household
    if household.update(household_params)
      redirect_to household, notice: "Household was successfully updated."
    else
      redirect_to edit_household_path, inertia: { errors: household.errors }
    end
  end

  # @route DELETE /households/:slug (household)
  def destroy
    authorize household
    household.destroy!
    redirect_to households_url, notice: "Household was successfully destroyed."
  end
end
