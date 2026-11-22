class Employees::OffersController < Employees::BaseController
  expose :offer, model: Employee::Offer, scope: -> { employee.offers }

  strong_params :offer, permit: [
    :job_title_id, :proposed_start_on, :rate, :rate_cents, :rate_currency,
    :period, :employee_number, :status, :notes,
  ]

  # @route POST /employees/:employee_slug/offers (employee_offers)
  def create
    authorize_employee_update!
    commit = offer_commit
    offer.assign_attributes(offer_attributes)
    offer.employee = employee
    offer.status = :extended if offer.status.blank? || offer.draft?

    if offer.save
      if commit == "apply"
        Employee::Offers::Accept.call(offer: offer)
      else
        extend_offer_and_employee_status!(offer)
      end
    end
    redirect_after_offer
  rescue ActiveRecord::RecordInvalid, ArgumentError => e
    redirect_after_offer(errors: { base: [e.message] })
  end

  # @route PATCH /employees/:employee_slug/offers/:id (employee_offer)
  # @route PUT /employees/:employee_slug/offers/:id (employee_offer)
  def update
    authorize_employee_update!

    next_status = offer_params[:status].presence
    attrs = offer_attributes

    if next_status == "accepted"
      offer.assign_attributes(attrs.except(:status))
      offer.save!
      Employee::Offers::Accept.call(offer: offer)
    else
      offer.update!(attrs)
      extend_offer_and_employee_status!(offer) if offer.extended? || offer.negotiating?
    end

    redirect_after_offer
  rescue ActiveRecord::RecordInvalid, ArgumentError => e
    redirect_after_offer(errors: { base: [e.message] })
  end

  # @route DELETE /employees/:employee_slug/offers/:id (employee_offer)
  def destroy
    authorize_employee_update!
    offer.destroy!
    redirect_after_offer
  end

  private

  def offer_commit
    params.dig(:offer, :commit).presence || params[:commit].presence || "offer"
  end

  def offer_attributes
    offer_params.to_h.symbolize_keys.except(:commit)
  end

  def redirect_after_offer(errors: nil)
    if params[:return_to].to_s == "status"
      if errors.present?
        redirect_to status_employee_path(employee), inertia: { errors: errors }
      else
        redirect_to status_employee_path(employee)
      end
    else
      redirect_to_employee_tab("hiring")
    end
  end

  def extend_offer_and_employee_status!(record)
    return unless record.extended? || record.negotiating?
    return unless employee.applicant?
    return unless employee.may_make_offer?

    employee.make_offer!
  end
end
