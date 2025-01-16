class PeopleController < ApplicationController
  include Searchable

  expose :people, -> { search(Person.includes_associated) }
  expose :person, scope: ->{ Person }, find: ->(id, scope){ scope.includes_associated.find(id) }

  sortable_fields %w(first_name last_name middle_name nick_name dob created_at updated_at)

  strong_params :person, permit: [:first_name, :last_name, :middle_name, :nick_name, :dob]

  # @route GET /users (users)
  def index
    authorize people
    paginated_people = paginate(people, :people)

    render inertia: "People/Index", props: {
      people: -> { paginated_people.render(:index) },
      pagination: -> { {
        count: people.count,
        **pagination_data(paginated_people)
      } }
    }
  end

  # @route GET /users/:slug (user)
  def show
    authorize person
    render inertia: "People/Show", props: {
      person: -> { person.render(:show) }
    }
  end

  # @route GET /users/new (new_user)
  def new
    authorize Person.new
    render inertia: "People/New", props: {
      person: Person.new.render(:form_data)
    }
  end

  # @route GET /users/:slug/edit (edit_user)
  def edit
    authorize person
    render inertia: "People/Edit", props: {
      person: person.render(:edit)
    }
  end

  # @route POST /users (user_registration)
  def create
    authorize Person.new
    if person.save
      redirect_to person, notice: "Person was successfully created."
    else
      redirect_to new_person_path, inertia: { errors: person.errors }
    end
  end

  # @route PATCH /users/:slug (user)
  # @route PUT /users/:slug (user)
  def update
    authorize person
    if person.update(person_params)
      redirect_to person, notice: "Person was successfully updated."
    else
      redirect_to edit_person_path, inertia: { errors: person.errors }
    end
  end

  # @route DELETE /users/:slug (user)
  def destroy
    authorize person
    person.destroy!
    redirect_to people_url, notice: "Person was successfully destroyed."
  end
end
