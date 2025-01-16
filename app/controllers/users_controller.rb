class UsersController < ApplicationController
  include Searchable

  expose :users, -> { search(User.all.includes_associated) }
  expose :user, scope: -> { User.includes_associated }

  sortable_fields %w[email active first_name last_name number]

  strong_params :user, permit: [:email, :password, :active, :first_name, :last_name, :number]

  def show
    authorize user
    render inertia: "Users/Show", props: {
      user: user.render,
    }
  end

  def new
    authorize User
    render inertia: "Users/New", props: {
      user: user.render,
    }
  end

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

  def update
    authorize user
    if user.update(user_params)
      redirect_to user, notice: t("users.notices.updated")
    else
      redirect_to edit_user_path(user), inertia: { errors: user.errors }
    end
  end

  def destroy
    authorize user
    user.destroy
    respond_to do
      redirect_to users_url, notice: t("users.notices.destroyed")
    end
  end
end
