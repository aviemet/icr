class IdentificationsController < ApplicationController
  include Searchable

  expose :identifications, -> { search(Identification.includes_associated, sortable_fields) }
  expose :identification, scope: ->{ Identification }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /identifications (identifications)
  def index
    authorize identifications
    render inertia: "Identification/Index", props: {
      identifications: -> { identifications.render(view: :index) }
    }
  end

  # @route GET /identifications/:id (identification)
  def show
    authorize identification
    render inertia: "Identification/Show", props: {
      identification: -> { identification.render(view: :show) }
    }
  end

  # @route GET /identifications/new (new_identification)
  def new
    authorize Identification.new
    render inertia: "Identification/New", props: {
      identification: Identification.new.render(view: :form_data)
    }
  end

  # @route GET /identifications/:id/edit (edit_identification)
  def edit
    authorize identification
    render inertia: "Identification/Edit", props: {
      identification: identification.render(view: :edit)
    }
  end

  # @route POST /identifications (identifications)
  def create
    authorize Identification.new
    if identification.save
      redirect_to identification, notice: "Identification was successfully created."
    else
      redirect_to new_identification_path, inertia: { errors: identification.errors }
    end
  end

  # @route PATCH /identifications/:id (identification)
  # @route PUT /identifications/:id (identification)
  def update
    authorize identification
    if identification.update(identification_params)
      redirect_to identification, notice: "Identification was successfully updated."
    else
      redirect_to edit_identification_path, inertia: { errors: identification.errors }
    end
  end

  # @route DELETE /identifications/:id (identification)
  def destroy
    authorize identification
    identification.destroy!
    redirect_to identifications_url, notice: "Identification was successfully destroyed."
  end

  private

  def sortable_fields
    %w(identificationable_id identificationable_type type number notes issued_at expires_at extra_fields).freeze
  end

  def identification_params
    params.require(:identification).permit(:identificationable_id, :identificationable_type, :type, :number, :notes, :issued_at, :expires_at, :extra_fields)
  end
end
