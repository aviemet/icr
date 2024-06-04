class DoctorsController < ApplicationController
  include Searchable

  expose :doctors, -> { search(Doctor.includes_associated, sortable_fields) }
  expose :doctor, scope: ->{ Doctor }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /doctors (doctors)
  def index
    authorize doctors
    render inertia: "Doctor/Index", props: {
      doctors: -> { doctors.render(view: :index) }
    }
  end

  # @route GET /doctors/:id (doctor)
  def show
    authorize doctor
    render inertia: "Doctor/Show", props: {
      doctor: -> { doctor.render(view: :show) }
    }
  end

  # @route GET /doctors/new (new_doctor)
  def new
    authorize Doctor.new
    render inertia: "Doctor/New", props: {
      doctor: Doctor.new.render(view: :form_data)
    }
  end

  # @route GET /doctors/:id/edit (edit_doctor)
  def edit
    authorize doctor
    render inertia: "Doctor/Edit", props: {
      doctor: doctor.render(view: :edit)
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

  # @route PATCH /doctors/:id (doctor)
  # @route PUT /doctors/:id (doctor)
  def update
    authorize doctor
    if doctor.update(doctor_params)
      redirect_to doctor, notice: "Doctor was successfully updated."
    else
      redirect_to edit_doctor_path, inertia: { errors: doctor.errors }
    end
  end

  # @route DELETE /doctors/:id (doctor)
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
