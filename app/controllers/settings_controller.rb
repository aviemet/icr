class SettingsController < ApplicationController
  include Searchable

  expose :settings, -> { search(@active_company.settings.includes_associated, sortable_fields) }
  expose :setting, scope: ->{ @active_company.settings }, find: ->(id, scope){ scope.includes_associated.find(id) }

  sortable_fields %w(data)

  strong_params :settings, permit: [:data]

  def index
    authorize settings

    paginated_settings = settings.page(params[:page] || 1).per(current_user.limit(:items))

    render inertia: "Settings/Index", props: {
      settings: -> { paginated_settings.render(:index) },
      pagination: -> { {
        count: settings.size,
        **pagination_data(paginated_settings)
      } },
    }
  end

  def show
    authorize setting
    render inertia: "Setting/Show", props: {
      setting: -> { setting.render(:show) }
    }
  end

  def new
    authorize Setting.new
    render inertia: "Setting/New", props: {
      setting: Setting.new.render(:form_data)
    }
  end

  def edit
    authorize setting
    render inertia: "Setting/Edit", props: {
      setting: setting.render(:edit)
    }
  end

  def create
    authorize Setting.new
    if setting.save
      redirect_to setting, notice: "Setting was successfully created."
    else
      redirect_to new_setting_path, inertia: { errors: setting.errors }
    end
  end

  def update
    authorize setting
    if setting.update(setting_params)
      redirect_to setting, notice: "Setting was successfully updated."
    else
      redirect_to edit_setting_path, inertia: { errors: setting.errors }
    end
  end

  def destroy
    authorize setting
    setting.destroy!
    redirect_to settings_url, notice: "Setting was successfully destroyed."
  end
end
