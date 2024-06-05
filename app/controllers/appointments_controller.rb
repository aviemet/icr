class AppointmentsController < ApplicationController
  include Searchable

  expose :appointments, -> { search(Appointment.includes_associated, sortable_fields) }
  expose :appointment, scope: ->{ Appointment }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /appointments (appointments)
  def index
    authorize appointments
    render inertia: "Appointment/Index", props: {
      appointments: -> { appointments.render(view: :index) }
    }
  end

  # @route GET /appointments/:id (appointment)
  def show
    authorize appointment
    render inertia: "Appointment/Show", props: {
      appointment: -> { appointment.render(view: :show) }
    }
  end

  # @route GET /appointments/new (new_appointment)
  def new
    authorize Appointment.new
    render inertia: "Appointment/New", props: {
      appointment: Appointment.new.render(view: :form_data)
    }
  end

  # @route GET /appointments/:id/edit (edit_appointment)
  def edit
    authorize appointment
    render inertia: "Appointment/Edit", props: {
      appointment: appointment.render(view: :edit)
    }
  end

  # @route POST /appointments (appointments)
  def create
    authorize Appointment.new
    if appointment.save
      redirect_to appointment, notice: "Appointment was successfully created."
    else
      redirect_to new_appointment_path, inertia: { errors: appointment.errors }
    end
  end

  # @route PATCH /appointments/:id (appointment)
  # @route PUT /appointments/:id (appointment)
  def update
    authorize appointment
    if appointment.update(appointment_params)
      redirect_to appointment, notice: "Appointment was successfully updated."
    else
      redirect_to edit_appointment_path, inertia: { errors: appointment.errors }
    end
  end

  # @route DELETE /appointments/:id (appointment)
  def destroy
    authorize appointment
    appointment.destroy!
    redirect_to appointments_url, notice: "Appointment was successfully destroyed."
  end

  private

  def sortable_fields
    %w(first_name last_name notes).freeze
  end

  def appointment_params
    params.require(:appointment).permit(:first_name, :last_name, :notes)
  end
end
