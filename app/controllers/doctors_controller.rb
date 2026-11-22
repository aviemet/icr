class DoctorsController < ApplicationController
  include Searchable

  expose :doctors, -> { search(Doctor.includes_associated) }
  expose :doctor, id: -> { params[:slug] }, scope: -> { Doctor.includes_show }, find_by: :slug

  sortable_fields %w[first_name last_name specialty practice_name]

  strong_params :doctor, permit: [
    :specialty, :npi, :practice_name, :notes,
    person_attributes: [
      :id, :first_name, :last_name, :middle_name, :nick_name, :dob, :characteristics,
      contact_attributes: [
        :id,
        phones_attributes: [:id, :name, :number, :extension, :notes, :category_id, :_destroy],
        emails_attributes: [:id, :name, :email, :notes, :category_id, :_destroy],
        addresses_attributes: [
          :id, :name, :address, :address_2, :city, :region, :postal, :country, :notes, :category_id, :_destroy,
        ],
      ],
    ],
  ]

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
      doctor: -> { doctor.render(:show) },
      can_update: -> { policy(doctor).update? }
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

    doctor.assign_attributes(doctor_params)

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
      redirect_to edit_doctor_path(doctor), inertia: { errors: doctor.errors }
    end
  end

  # @route DELETE /doctors/:slug (doctor)
  def destroy
    authorize doctor

    doctor.destroy!
    redirect_to doctors_url, notice: t("templates.controllers.notices.destroyed", model: "Doctor")
  end
end
