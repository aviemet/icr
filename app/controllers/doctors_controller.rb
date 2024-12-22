class DoctorsController < ApplicationController
  include Searchable

  expose :doctors, -> { search(Doctor.includes_associated, sortable_fields) }
  expose :doctor, scope: ->{ Doctor }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /doctors (doctors)
  def index
    authorize doctors
    render inertia: "Doctor/Index", props: {
      doctors: -> { doctors.render(:index) }
    }
  end

  # @route GET /doctors/:slug (doctor)
  def show
    authorize doctor
    render inertia: "Doctor/Show", props: {
      doctor: -> { doctor.render(:show) }
    }
  end

  # @route GET /doctors/new (new_doctor)
  def new
    authorize Doctor.new
    render inertia: "Doctor/New", props: {
      doctor: Doctor.new.render(:form_data)
    }
  end

  # @route GET /doctors/:slug/edit (edit_doctor)
  def edit
    authorize doctor
    render inertia: "Doctor/Edit", props: {
      doctor: doctor.render(:edit)
    }
  end

  # @route POST /doctors (doctors)
  def create
    authorize Doctor.new
    if doctor.save
      redirect_to doctor, notice: "Doctor was successfully created."
    else
      redirect_to new_doctor_path, inertia: { errors: doctor.errors }
    end
  end

  # @route PATCH /doctors/:slug (doctor)
  # @route PUT /doctors/:slug (doctor)
  def update
    authorize doctor
    if doctor.update(doctor_params)
      redirect_to doctor, notice: "Doctor was successfully updated."
    else
      redirect_to edit_doctor_path, inertia: { errors: doctor.errors }
    end
  end

  # @route DELETE /doctors/:slug (doctor)
  def destroy
    authorize doctor
    doctor.destroy!
    redirect_to doctors_url, notice: "Doctor was successfully destroyed."
  end

  private

  def sortable_fields
    %w(first_name last_name notes).freeze
  end

  def doctor_params
    params.require(:doctor).permit(:first_name, :last_name, :notes)
  end
end
