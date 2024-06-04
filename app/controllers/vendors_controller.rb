class VendorsController < ApplicationController
  include Searchable

  expose :vendors, -> { search(Vendor.includes_associated, sortable_fields) }
  expose :vendor, scope: ->{ Vendor }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /vendors (vendors)
  def index
    authorize vendors
    render inertia: "Vendor/Index", props: {
      vendors: -> { vendors.render(view: :index) }
    }
  end

  # @route GET /vendors/:id (vendor)
  def show
    authorize vendor
    render inertia: "Vendor/Show", props: {
      vendor: -> { vendor.render(view: :show) }
    }
  end

  # @route GET /vendors/new (new_vendor)
  def new
    authorize Vendor.new
    render inertia: "Vendor/New", props: {
      vendor: Vendor.new.render(view: :form_data)
    }
  end

  # @route GET /vendors/:id/edit (edit_vendor)
  def edit
    authorize vendor
    render inertia: "Vendor/Edit", props: {
      vendor: vendor.render(view: :edit)
    }
  end

  # @route POST /vendors (vendors)
  def create
    authorize Vendor.new
    if vendor.save
      redirect_to vendor, notice: "Vendor was successfully created."
    else
      redirect_to new_vendor_path, inertia: { errors: vendor.errors }
    end
  end

  # @route PATCH /vendors/:id (vendor)
  # @route PUT /vendors/:id (vendor)
  def update
    authorize vendor
    if vendor.update(vendor_params)
      redirect_to vendor, notice: "Vendor was successfully updated."
    else
      redirect_to edit_vendor_path, inertia: { errors: vendor.errors }
    end
  end

  # @route DELETE /vendors/:id (vendor)
  def destroy
    authorize vendor
    vendor.destroy!
    redirect_to vendors_url, notice: "Vendor was successfully destroyed."
  end

  private

  def sortable_fields
    %w(category_id name notes).freeze
  end

  def vendor_params
    params.require(:vendor).permit(:category_id, :name, :notes)
  end
end
