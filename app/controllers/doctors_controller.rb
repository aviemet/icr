class DoctorsController < ApplicationController
  include Searchable

  expose :doctors, -> { search(Doctor.includes_associated) }
  expose :doctor, scope: ->{ Doctor.includes_associated }

  sortable_fields %w(first_name last_name notes)

  strong_params :doctor, permit: [:first_name, :last_name, :notes]

  # @route GET /doctors (doctors)
  def index
    authorize doctors

    paginated_doctors = paginate(doctors, :doctors)

    render inertia: "Doctors/Index", props: {
      doctors: -> { paginated_doctors.render(:index) },
      pagination: -> { {
        count: doctors.count,
        **pagination_data(paginated_doctors)
      } }
    }
  end

  # @route GET /doctors/:slug (doctor)
  def show
    authorize doctor
    render inertia: "Doctors/Show", props: {
      doctor: -> { doctor.render(:show) }
    }
  end

  # @route GET /doctors/new (new_doctor)
  def new
    authorize Doctor.new
    render inertia: "Doctors/New", props: {
      doctor: Doctor.new.render(:form_data)
    }
  end

  # @route GET /doctors/:slug/edit (edit_doctor)
  def edit
    authorize doctor
    render inertia: "Doctors/Edit", props: {
      doctor: doctor.render(:edit)
    }
  end

  # @route POST /doctors (doctors)
  def create
    authorize Doctor.new
    if doctor.save
      redirect_to doctor, notice: t("templates.controllers.notices.created", model: "Doctor")
    else
      redirect_to new_doctor_path, inertia: { errors: doctor.errors }
    end
  end

  # @route PATCH /doctors/:slug (doctor)
  # @route PUT /doctors/:slug (doctor)
  def update
    authorize doctor
    if doctor.update(doctor_params)
      redirect_to doctor, notice: t("templates.controllers.notices.updated", model: "Doctor")
    else
      redirect_to edit_doctor_path, inertia: { errors: doctor.errors }
    end
  end

  # @route DELETE /doctors/:slug (doctor)
  def destroy
    authorize doctor
    doctor.destroy!
    redirect_to doctors_url, notice: t("templates.controllers.notices.destroyed", model: "Doctor")
  end
end
