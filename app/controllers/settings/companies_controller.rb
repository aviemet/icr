class Settings::CompaniesController < ApplicationController
  strong_params :company, permit: [
    :name,
    :regional_center_id,
    contact_attributes: [
      :id,
      addresses_attributes: [
        :id, :name, :address, :address_2, :city, :region, :postal, :country, :notes, :category_id, :_destroy,
      ],
      phones_attributes: [
        :id, :name, :number, :extension, :notes, :category_id, :_destroy,
      ],
    ],
  ]

  # @route GET /settings/company (settings_company)
  def show
    authorize company

    render inertia: "Settings/Company/Details", props: {
      company: -> { company.render(:show) },
      regional_center_options: -> { RegionalCenter.active.ordered.render(:options) },
    }
  end

  # @route PATCH /settings/company (settings_company)
  # @route PUT /settings/company (settings_company)
  def update
    authorize company

    if company.update(company_params)
      redirect_to settings_company_path, success: t("settings.notices.updated")
    else
      redirect_to settings_company_path, inertia: { errors: company.errors }
    end
  end

  private

  def company
    @company ||= Company.instance
  end
end
