class JobTitlesController < ApplicationController
  include Searchable

  expose :job_titles, -> { search(JobTitle.includes_associated) }
  expose :job_title, find: ->(id, scope){ scope.includes_associated.find(id) }

  sortable_fields %w(title description)

  strong_params :job_title, permit: [:title, :description]

  # @route GET /job_titles (job_titles)
  def index
    authorize job_titles

    paginated_job_titles = paginate(job_titles, :job_titles)

    render inertia: "JobTitles/Index", props: {
      job_titles: -> { paginated_job_titles.render(:index) },
      pagination: -> { {
        count: job_titles.count,
        **pagination_data(paginated_job_titles)
      } }
    }
  end

  # @route GET /job_titles/:id (job_title)
  def show
    authorize job_title
    render inertia: "JobTitles/Show", props: {
      job_title: -> { job_title.render(:show) }
    }
  end

  # @route GET /job_titles/new (new_job_title)
  def new
    authorize JobTitle.new
    render inertia: "JobTitles/New", props: {
      job_title: JobTitle.new.render(:new)
    }
  end

  # @route GET /job_titles/:id/edit (edit_job_title)
  def edit
    authorize job_title
    render inertia: "JobTitles/Edit", props: {
      job_title: job_title.render(:edit)
    }
  end

  # @route POST /job_titles (job_titles)
  def create
    authorize JobTitle.new
    if job_title.save
      redirect_to job_title, notice: "Job title was successfully created."
    else
      redirect_to new_job_title_path, inertia: { errors: job_title.errors }
    end
  end

  # @route PATCH /job_titles/:id (job_title)
  # @route PUT /job_titles/:id (job_title)
  def update
    authorize job_title
    if job_title.update(job_title_params)
      redirect_to job_title, notice: "Job title was successfully updated."
    else
      redirect_to edit_job_title_path, inertia: { errors: job_title.errors }
    end
  end

  # @route DELETE /job_titles/:id (job_title)
  def destroy
    authorize job_title
    job_title.destroy!
    redirect_to job_titles_url, notice: "Job title was successfully destroyed."
  end
end
