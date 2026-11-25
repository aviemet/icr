class Households::MembershipsController < Households::BaseController
  expose :membership, model: HouseholdsClient, scope: -> { household.households_clients }, id: :id

  strong_params :households_client, permit: [:client_id, :starts_at, :ends_at]

  # @route POST /households/:household_slug/memberships (household_memberships)
  def create
    authorize_household_update!

    client = Client.find(households_client_params[:client_id])
    starts_at = households_client_params[:starts_at].presence || Date.current
    membership = Households::AssignClient.call(
      household: household,
      client: client,
      starts_at: starts_at,
    )

    if membership.persisted?
      redirect_to_household_tab("clients", notice: t("templates.controllers.notices.created", model: "Membership"))
    else
      redirect_to_household_tab("clients", inertia: { errors: membership.errors })
    end
  end

  # @route PATCH /households/:household_slug/memberships/:id (household_membership)
  # @route PUT /households/:household_slug/memberships/:id (household_membership)
  def update
    authorize_household_update!

    updated = if households_client_params.key?(:ends_at)
                Households::EndMembership.call(
                  membership: membership,
                  ends_at: households_client_params[:ends_at].presence || Date.current,
                )
              else
                membership.tap { |record| record.update(households_client_params.slice(:starts_at)) }
              end

    if updated.errors.empty?
      redirect_to_household_tab("clients", notice: t("templates.controllers.notices.updated", model: "Membership"))
    else
      redirect_to_household_tab("clients", inertia: { errors: updated.errors })
    end
  end
end
