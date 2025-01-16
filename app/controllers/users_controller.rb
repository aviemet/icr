class UsersController < ApplicationController
  include Searchable

  expose :users, -> { search(User.all.includes_associated, sortable_fields) }
  expose :user, scope: -> { User.includes_associated }
  expose :people, scope: -> { Person.includes_associated }

  sortable_fields %w[email active first_name last_name number]

  strong_params :user, permit: [:email, :password, :active, :first_name, :last_name, :number]

  # @route GET /users (users)
  def index
    authorize people
    paginated_people = paginate(people, :people)

    render inertia: "Users/Index", props: {
      people: -> { paginated_people.render(:index) },
      pagination: -> { {
        count: people.count,
        **pagination_data(paginated_people),
      } },
    }
  end

  # @route GET /users/:id (user)
  def show
    authorize user
    render inertia: "Users/Show", props: {
      user: user.render,
    }
  end

  # @route GET /users/new (new_user)
  def new
    authorize User
    render inertia: "Users/New", props: {
      user: user.render,
    }
  end

  # @route GET /users/:id/edit (edit_user)
  def edit
    authorize user
    render inertia: "Users/Edit", props: {
      user: user.render,
    }
  end

  def complete_registration
    render inertia: "Public/Devise/Register/Complete"
  end

  def save_complete_registration
    params.permit!

    person = Person.new(params[:person])
    person.user = current_user

    if current_user.save
      redirect_to root_path
    end
  rescue ActiveRecord::RecordInvalid
    redirect_to complete_registration_path
  end

  # @route PATCH /users/:id (user)
  # @route PUT /users/:id (user)
  def update
    authorize user
    if user.update(user_params)
      redirect_to user, notice: t("users.notices.updated")
    else
      redirect_to edit_user_path(user), inertia: { errors: user.errors }
    end
  end

  # @route DELETE /users/:id (user)
  def destroy
    authorize user
    user.destroy
    respond_to do
      redirect_to users_url, notice: t("users.notices.destroyed")
    end
  end
end
