class DoctorsController < ApplicationController
  include Searchable

  expose :doctors, -> { search(Doctor.includes_associated, sortable_fields) }
  expose :doctor, scope: ->{ Doctor }, find: ->(id, scope){ scope.includes_associated.find(id) }

  def index
    authorize doctors
    render inertia: "Doctor/Index", props: {
      doctors: -> { doctors.render(view: :index) }
    }
  end

  def show
    authorize doctor
    render inertia: "Doctor/Show", props: {
      doctor: -> { doctor.render(view: :show) }
    }
  end

  def new
    authorize Doctor.new
    render inertia: "Doctor/New", props: {
      doctor: Doctor.new.render(view: :form_data)
    }
  end

  def edit
    authorize doctor
    render inertia: "Doctor/Edit", props: {
      doctor: doctor.render(view: :edit)
    }
  end

  def create
    authorize Doctor.new
    if doctor.save
      redirect_to doctor, notice: "Doctor was successfully created."
    else
      redirect_to new_doctor_path, inertia: { errors: doctor.errors }
    end
  end

  def update
    authorize doctor
    if doctor.update(doctor_params)
      redirect_to doctor, notice: "Doctor was successfully updated."
    else
      redirect_to edit_doctor_path, inertia: { errors: doctor.errors }
    end
  end

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
