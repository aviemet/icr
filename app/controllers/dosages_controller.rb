class DosagesController < ApplicationController
  include Searchable

  expose :dosages, -> { search(@active_company.dosages.includes_associated, sortable_fields) }
    expose :dosage, scope: ->{ @active_company.dosages }, find: ->(id, scope){ scope.includes_associated.find(id) }
  
  def index
    authorize dosages
    render inertia: "Dosage/Index", props: {
      dosages: -> { dosages.render(view: :index) }
    }
  end

  def show
    authorize dosage
    render inertia: "Dosage/Show", props: {
      dosage: -> { dosage.render(view: :show) }
    }
  end

  def new
    authorize Dosage.new
    render inertia: "Dosage/New", props: {
      dosage: Dosage.new.render(view: :form_data)
    }
  end

  def edit
    authorize dosage
    render inertia: "Dosage/Edit", props: {
      dosage: dosage.render(view: :edit)
    }
  end

  def create
    authorize Dosage.new
    if dosage.save
      redirect_to dosage, notice: "Dosage was successfully created."
    else
      redirect_to new_dosage_path, inertia: { errors: dosage.errors }
    end
  end

  def update
    authorize dosage
    if dosage.update(dosage_params)
      redirect_to dosage, notice: "Dosage was successfully updated."
    else
      redirect_to edit_dosage_path, inertia: { errors: dosage.errors }
    end
  end

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
