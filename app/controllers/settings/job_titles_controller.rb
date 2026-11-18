class Settings::JobTitlesController < ApplicationController
  expose :job_titles, -> { Employee::JobTitle.includes_associated.order(:name) }
  expose :job_title,
    model: Employee::JobTitle,
    id: -> { params[:slug] },
    scope: -> { Employee::JobTitle.includes_associated },
    find_by: :slug

  strong_params :job_title, permit: [:name, :description, :department_id]

  # @route GET /settings/job_titles (settings_job_titles)
  def index
    authorize job_titles

    render inertia: "Settings/JobTitles/Index", props: {
      job_titles: -> { job_titles.render(:index) }
    }
  end

  # @route GET /settings/job_titles/:slug (settings_job_title)
  def show
    authorize job_title

    render inertia: "Settings/JobTitles/Show", props: {
      job_title: -> { job_title.render(:show) },
      permissions: -> { job_title.permissions_hash },
      employees: -> { job_title.active_employees.render(:index) }
    }
  end

  # @route GET /settings/job_titles/new (new_settings_job_title)
  def new
    authorize Employee::JobTitle.new

    render inertia: "Settings/JobTitles/New", props: {
      job_title: Employee::JobTitle.new.render(:form_data),
      permissions: Employee::JobTitle::PermissionsCatalog.empty_permissions
    }
  end

  # @route GET /settings/job_titles/:slug/edit (edit_settings_job_title)
  def edit
    authorize job_title

    render inertia: "Settings/JobTitles/Edit", props: {
      job_title: -> { job_title.render(:edit) },
      permissions: -> { job_title.permissions_hash }
    }
  end

  # @route POST /settings/job_titles (settings_job_titles)
  def create
    authorize Employee::JobTitle.new

    if job_title.save
      job_title.sync_permissions!(permissions_params)
      redirect_to settings_job_titles_path, notice: t("templates.controllers.notices.created", model: "Job title")
    else
      render inertia: "Settings/JobTitles/New", props: {
        job_title: job_title.render(:form_data),
        permissions: permissions_params.presence || Employee::JobTitle::PermissionsCatalog.empty_permissions
      }
    end
  end

  # @route PATCH /settings/job_titles/:slug (settings_job_title)
  # @route PUT /settings/job_titles/:slug (settings_job_title)
  def update
    authorize job_title

    if job_title.update(job_title_params)
      job_title.sync_permissions!(permissions_params)
      redirect_to settings_job_titles_path, notice: t("templates.controllers.notices.updated", model: "Job title")
    else
      render inertia: "Settings/JobTitles/Edit", props: {
        job_title: job_title.render(:edit),
        permissions: permissions_params.presence || job_title.permissions_hash
      }
    end
  end

  # @route DELETE /settings/job_titles/:slug (settings_job_title)
  def destroy
    authorize job_title
    job_title.destroy!
    redirect_to settings_job_titles_path, notice: t("templates.controllers.notices.destroyed", model: "Job title")
  end

  private

  def permissions_params
    permitted = params.fetch(:permissions, {}).permit(
      :admin,
      **Employee::JobTitle::PermissionsCatalog.resource_keys.index_with do
        [:index, :show, :create, :update, :delete]
      end,
    )
    permitted.to_h
  end
end
