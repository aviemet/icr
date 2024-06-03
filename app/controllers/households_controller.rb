class HouseholdsController < ApplicationController
  include Searchable

  expose :households, -> { search(Household.includes_associated, sortable_fields) }
  expose :household, scope: ->{ Household }, find: ->(id, scope){ scope.includes_associated.find(id) }

  def index
    authorize households
    render inertia: "Household/Index", props: {
      households: -> { households.render(view: :index) }
    }
  end

  def show
    authorize household
    render inertia: "Household/Show", props: {
      household: -> { household.render(view: :show) }
    }
  end

  def new
    authorize Household.new
    render inertia: "Household/New", props: {
      household: Household.new.render(view: :form_data)
    }
  end

  def edit
    authorize household
    render inertia: "Household/Edit", props: {
      household: household.render(view: :edit)
    }
  end

  def create
    authorize Household.new
    if household.save
      redirect_to household, notice: "Household was successfully created."
    else
      redirect_to new_household_path, inertia: { errors: household.errors }
    end
  end

  def update
    authorize household
    if household.update(household_params)
      redirect_to household, notice: "Household was successfully updated."
    else
      redirect_to edit_household_path, inertia: { errors: household.errors }
    end
  end

  def destroy
    authorize household
    household.destroy!
    redirect_to households_url, notice: "Household was successfully destroyed."
  end

  private

  def sortable_fields
    %w(householdable_id householdable_type type number notes issued_at expires_at extra_fields).freeze
  end

  def household_params
    params.require(:household).permit(:householdable_id, :householdable_type, :type, :number, :notes, :issued_at, :expires_at, :extra_fields)
  end
end
