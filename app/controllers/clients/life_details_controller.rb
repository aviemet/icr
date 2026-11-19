class Clients::LifeDetailsController < Clients::BaseController
  strong_params :life_detail, permit: [
    :adls, :adaptive_supports, :behavior_supports, :routines, :risk_flags,
  ]

  # @route PATCH /clients/:client_slug/life_detail (client_life_detail)
  # @route PUT /clients/:client_slug/life_detail (client_life_detail)
  def update
    authorize_client_update!
    life_detail = client.life_detail || client.build_life_detail

    life_detail.update(life_detail_params)
    redirect_to_client_tab("profile")
  end
end
