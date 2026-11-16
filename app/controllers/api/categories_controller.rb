class Api::CategoriesController < Api::ApiController
  expose :categories, -> {
    if params[:category_type]
      Category.where(categorizable_type: params[:category_type])
    else
      Category
    end
  }
  expose :category, id: ->{ params[:slug] }, scope: ->{ Category }, find_by: :slug

  strong_params :category, permit: [:name, :categorizable_type, :description]

  def index
    render json: categories.includes_associated.render
  end

  def show
    render json: category.render
  end

  # @route GET /api/options/categories/:category_type (api_category_options)
  def options
    render json: categories.render(:options)
  end

  # @route POST /api/categories (api_categories)
  def create
    category.assign_attributes(category_params)

    if category.save
      render json: category.render, status: :created
    else
      render json: { errors: category.errors }, status: :unprocessable_content
    end
  end

  # @route PATCH /api/categories/:slug (api_category)
  # @route PUT /api/categories/:slug (api_category)
  def update
    if category.update(category_params)
      render json: category.render, status: :ok
    else
      render json: { errors: category.errors }, status: :unprocessable_content
    end
  end

  # @route DELETE /api/categories/:slug (api_category)
  def destroy
    if category.destroy
      head :no_content
    else
      render json: { errors: category.errors }, status: :unprocessable_content
    end
  end
end
