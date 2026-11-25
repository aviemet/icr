class Households::BaseController < ApplicationController
  expose :household, id: -> { params[:household_slug] || params[:slug] },
    scope: -> { policy_scope(Household) },
    find_by: :slug

  before_action :authorize_household!

  private

  def authorize_household!
    authorize household, :show?
  end

  def authorize_household_update!
    authorize household, :update?
  end

  def redirect_to_household_tab(tab, section: nil, **)
    redirect_to(household_path(household, { tab: tab, section: section }.compact), **)
  end
end
