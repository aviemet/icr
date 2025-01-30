class Api::CategoriesController < Api::ApiController
  expose :categories, -> {
    if params[:category_type]
      Categories.where(categorizable_type: params[:category_type])
    else
      Categories
    end
  }
  expose :category, id: ->{ params[:slug] }, scope: ->{ Categories }, find_by: :slug

  strong_params :category, permit: [:name, :categorizable_type, :description]

  def index
    render json: categories.includes_associated.render
  end

  def show
    render json: category.render
  end

  # @route GET /api/options/categories/:category_type (api_category_options)
  def options
    render json: categories.render(view: :options)
  end

  # @route POST /api/categories (api_categories)
  def create
    category.company = @active_company

    if category.save
      render json: category.render, status: :created
    else
      render json: { errors: category.errors }, status: :see_other
    end
  end

  # @route PATCH /api/categories/:slug (api_category)
  # @route PUT /api/categories/:slug (api_category)
  def update
    if category.update(category_params)
      render json: category.render, status: :created
    else
      render json: { errors: category.errors }, status: :see_other
    end
  end
end
