class UsersController < ApplicationController
  include Searchable

  expose :users, -> { search(User.all.includes_associated) }
  expose :user, scope: -> { User.includes_associated }

  sortable_fields %w[email active first_name last_name number]

  strong_params :user, permit: [:email, :password, :active, :first_name, :last_name, :number]

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

end
