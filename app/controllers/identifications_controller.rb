class IdentificationsController < ApplicationController
  include Searchable

  expose :identifications, -> { Identification.includes_associated }
  expose :identification, scope: ->{ Identification }, find: ->(id, scope){ scope.includes_associated.find(id) }

  sortable_fields %w(identificationable_id identificationable_type type number notes issued_at expires_at extra_fields)

  strong_params :identification, permit: [:identificationable_id, :identificationable_type, :type, :number, :notes, :issued_at, :expires_at, :extra_fields]

  # @route GET /identifications (identifications)
  def index
    authorize identifications
    render inertia: "Identification/Index", props: {
      identifications: -> { identifications.render(:index) }
    }
  end

  # @route GET /identifications/:id (identification)
  def show
    authorize identification
    render inertia: "Identification/Show", props: {
      identification: -> { identification.render(:show) }
    }
  end

  # @route GET /identifications/new (new_identification)
  def new
    authorize Identification.new
    render inertia: "Identification/New", props: {
      identification: Identification.new.render(:form_data)
    }
  end

  # @route GET /identifications/:id/edit (edit_identification)
  def edit
    authorize identification
    render inertia: "Identification/Edit", props: {
      identification: identification.render(:edit)
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
end
