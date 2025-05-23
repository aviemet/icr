class VendorsController < ApplicationController
  include Searchable

  expose :vendors, -> { search(Vendor.includes_associated) }
  expose :vendor, id: ->{ params[:slug] }, scope: ->{ Vendor.includes_associated }, find_by: :slug

  sortable_fields %w(category_id name notes)

  strong_params :vendor, permit: [:category_id, :name, :notes]

  # @route GET /vendors (vendors)
  def index
    authorize vendors

    paginated_vendors = paginate(vendors, :vendors)

    render inertia: "Vendors/Index", props: {
      vendors: -> { paginated_vendors.render(:index) },
      pagination: -> { {
        count: vendors.count,
        **pagination_data(paginated_vendors)
      } }
    }
  end

  # @route GET /vendors/:slug (vendor)
  def show
    authorize vendor
    render inertia: "Vendors/Show", props: {
      vendor: -> { vendor.render(:show) }
    }
  end

  # @route GET /vendors/new (new_vendor)
  def new
    authorize Vendor.new
    render inertia: "Vendors/New", props: {
      vendor: Vendor.new.render(:form_data)
    }
  end

  # @route GET /vendors/:slug/edit (edit_vendor)
  def edit
    authorize vendor
    render inertia: "Vendors/Edit", props: {
      vendor: vendor.render(:edit)
    }
  end

  # @route POST /vendors (vendors)
  def create
    authorize Vendor.new
    if vendor.save
      redirect_to vendor, notice: t("templates.controllers.notices.created", model: "Vendor")
    else
      redirect_to new_vendor_path, inertia: { errors: vendor.errors }
    end
  end

  # @route PATCH /vendors/:slug (vendor)
  # @route PUT /vendors/:slug (vendor)
  def update
    authorize vendor
    if vendor.update(vendor_params)
      redirect_to vendor, notice: t("templates.controllers.notices.updated", model: "Vendor")
    else
      redirect_to edit_vendor_path, inertia: { errors: vendor.errors }
    end
  end

  # @route DELETE /vendors/:slug (vendor)
  def destroy
    authorize vendor
    vendor.destroy!
    redirect_to vendors_url, notice: t("templates.controllers.notices.destroyed", model: "Vendor")
  end

end
