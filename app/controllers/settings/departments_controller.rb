class Settings::DepartmentsController < ApplicationController
  expose :departments, -> { Employee::Department.includes_associated.order(:name) }
  expose :department,
    model: Employee::Department,
    id: -> { params[:slug] },
    scope: -> { Employee::Department.includes_associated },
    find_by: :slug

  strong_params :department, permit: [:name, :description]

  # @route GET /settings/departments (settings_departments)
  def index
    authorize departments

    render inertia: "Settings/Departments/Index", props: {
      departments: -> { departments.render(:index) }
    }
  end

  # @route GET /settings/departments/:slug (settings_department)
  def show
    authorize department

    render inertia: "Settings/Departments/Show", props: {
      department: -> { department.render(:show) },
      job_titles: -> { department.job_titles.render(:index) },
    }
  end

  # @route GET /settings/departments/new (new_settings_department)
  def new
    authorize Employee::Department.new

    render inertia: "Settings/Departments/New", props: {
      department: Employee::Department.new.render(:form_data),
    }
  end

  # @route GET /settings/departments/:slug/edit (edit_settings_department)
  def edit
    authorize department

    render inertia: "Settings/Departments/Edit", props: {
      department: -> { department.render(:edit) },
    }
  end

  # @route POST /settings/departments (settings_departments)
  def create
    authorize Employee::Department.new

    if department.save
      redirect_to settings_departments_path, notice: t("templates.controllers.notices.created", model: "Department")
    else
      render inertia: "Settings/Departments/New", props: {
        department: department.render(:form_data),
      }
    end
  end

  # @route PATCH /settings/departments/:slug (settings_department)
  # @route PUT /settings/departments/:slug (settings_department)
  def update
    authorize department

    if department.update(department_params)
      redirect_to settings_departments_path, notice: t("templates.controllers.notices.updated", model: "Department")
    else
      render inertia: "Settings/Departments/Edit", props: {
        department: department.render(:edit),
      }
    end
  end

  # @route DELETE /settings/departments (settings_departments)
  # @route DELETE /settings/departments/:slug (settings_department)
  def destroy
    if params[:ids].present?
      destroy_many
    else
      destroy_one
    end
  end

  private

  def destroy_many
    records = Employee::Department.where(id: Array(params[:ids]))
    records.each { |record| authorize record }

    destroyed_count = 0
    ActiveRecord::Base.transaction do
      records.find_each do |record|
        record.destroy!
        destroyed_count += 1
      end
    end

    redirect_to settings_departments_path,
      notice: t("templates.controllers.notices.destroyed_count", count: destroyed_count, model: "department")
  end

  def destroy_one
    authorize department
    department.destroy!
    redirect_to settings_departments_path, notice: t("templates.controllers.notices.destroyed", model: "Department")
  end
end
