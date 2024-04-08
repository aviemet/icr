class JobTitlesController < ApplicationController
  include Searchable

  expose :job_titles, -> { search(JobTitle.includes_associated, sortable_fields) }
    expose :job_title, find: ->(id, scope){ scope.includes_associated.find(id) }
  
  # @route GET /job_titles (job_titles)
  def index
    authorize job_titles

    paginated_job_titles = job_titles.page(params[:page] || 1).per(current_user.limit(:items))

    render inertia: "JobTitles/Index", props: {
      job_titles: -> { paginated_job_titles.render(view: :index) }
    }
  end

  # @route GET /job_titles/:id (job_title)
  def show
    authorize job_title
    render inertia: "JobTitles/Show", props: {
      job_title: -> { job_title.render(view: :show) }
    }
  end

  # @route GET /job_titles/new (new_job_title)
  def new
    authorize JobTitle.new
    render inertia: "JobTitles/New", props: {
      job_title: JobTitle.new.render(view: :new)
    }
  end

  # @route GET /job_titles/:id/edit (edit_job_title)
  def edit
    authorize job_title
    render inertia: "JobTitles/Edit", props: {
      job_title: job_title.render(view: :edit)
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

  private

  def sortable_fields
    %w(title description).freeze
  end

  def job_title_params
    params.require(:job_title).permit(:title, :description)
  end
end
