class Api::JobTitlesController < ApplicationController
  expose :job_titles, -> { policy_scope(Employee::JobTitle.includes_associated) }
  expose :job_title, id: ->{ params[:slug] }, scope: ->{ policy_scope(Employee::JobTitle.includes_associated) }, find_by: :slug

  # @route GET /api/options/job_titles (api_job_titles_options)
  def options
    render json: job_titles.render(:options)
  end
end
