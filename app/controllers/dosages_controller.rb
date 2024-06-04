class DosagesController < ApplicationController
  include Searchable

  expose :dosages, -> { search(Dosage.includes_associated, sortable_fields) }
  expose :dosage, scope: ->{ Dosage }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /dosages (dosages)
  def index
    authorize dosages
    render inertia: "Dosage/Index", props: {
      dosages: -> { dosages.render(view: :index) }
    }
  end

  # @route GET /dosages/:id (dosage)
  def show
    authorize dosage
    render inertia: "Dosage/Show", props: {
      dosage: -> { dosage.render(view: :show) }
    }
  end

  # @route GET /dosages/new (new_dosage)
  def new
    authorize Dosage.new
    render inertia: "Dosage/New", props: {
      dosage: Dosage.new.render(view: :form_data)
    }
  end

  # @route GET /dosages/:id/edit (edit_dosage)
  def edit
    authorize dosage
    render inertia: "Dosage/Edit", props: {
      dosage: dosage.render(view: :edit)
    }
  end

  # @route POST /dosages (dosages)
  def create
    authorize Dosage.new
    if dosage.save
      redirect_to dosage, notice: "Dosage was successfully created."
    else
      redirect_to new_dosage_path, inertia: { errors: dosage.errors }
    end
  end

  # @route PATCH /dosages/:id (dosage)
  # @route PUT /dosages/:id (dosage)
  def update
    authorize dosage
    if dosage.update(dosage_params)
      redirect_to dosage, notice: "Dosage was successfully updated."
    else
      redirect_to edit_dosage_path, inertia: { errors: dosage.errors }
    end
  end

  # @route DELETE /dosages/:id (dosage)
  def destroy
    authorize dosage
    dosage.destroy!
    redirect_to dosages_url, notice: "Dosage was successfully destroyed."
  end

  private

  def sortable_fields
    %w(amount amount_unit freq_amount freq_period notes).freeze
  end

  def dosage_params
    params.require(:dosage).permit(:amount, :amount_unit, :freq_amount, :freq_period, :notes)
  end
end
