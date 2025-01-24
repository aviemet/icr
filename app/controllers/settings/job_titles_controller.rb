class Settings::JobTitlesController < ApplicationController
  include Searchable

  expose :job_titles, -> { search(JobTitle.includes_associated) }
  expose :job_title, id: ->{ params[:slug] }, scope: ->{ JobTitle.includes_associated }, find_by: :slug

  sortable_fields %w[name]

  strong_params :job_title, permit: [:name, :description]

  # @route GET /settings/job_titles (settings_job_titles)
  def index
    authorize job_titles

    paginated_job_titles = paginate(job_titles, :job_titles)

    render inertia: "Settings/JobTitles/Index", props: {
      job_titles: -> { paginated_job_titles.render(:index) },
      pagination: -> { {
        count: job_titles.count,
        **pagination_data(paginated_job_titles)
      } }
    }
  end

  # @route GET /settings/job_titles/:slug (settings_job_title)
  def show
    authorize job_title
    ap({ params: })
    render inertia: "Settings/JobTitles/Show", props: {
      job_title: -> { job_title.render(:show) }
    }
  end

  # @route GET /settings/job_titles/new (new_settings_job_title)
  def new
    authorize JobTitle.new

    render inertia: "Settings/JobTitles/New", props: {
      job_title: JobTitle.new.render(:form_data)
    }
  end

  # @route GET /settings/job_titles/:slug/edit (edit_settings_job_title)
  def edit
    authorize job_title

    render inertia: "Settings/JobTitles/Edit", props: {
      job_title: -> { job_title.render(:edit) }
    }
  end

  # @route POST /settings/job_titles (settings_job_titles)
  def create
    authorize JobTitle.new

    if job_title.save
      redirect_to settings_job_title_path(job_title.slug), notice: "Job title created"
    else
      render inertia: "Settings/JobTitles/New", props: {
        job_title: job_title.render(:form_data)
      }
    end
  end

  # @route PATCH /settings/job_titles/:slug (settings_job_title)
  # @route PUT /settings/job_titles/:slug (settings_job_title)
  def update
    authorize job_title

    if job_title.update(job_title_params)
      redirect_to settings_job_title_path(job_title.slug), notice: "Job title updated"
    else
      render inertia: "Settings/JobTitles/Edit", props: {
        job_title: job_title.render(:edit)
      }
    end
  end

  # @route DELETE /settings/job_titles/:slug (settings_job_title)
  def destroy
    authorize job_title
    job_title.destroy!
    redirect_to settings_job_titles_path, notice: "Job title deleted"
  end
end
