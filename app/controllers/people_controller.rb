class PeopleController < ApplicationController
  include Searchable

  expose :people, -> { search(Person.includes_associated, sortable_fields) }
  expose :person, scope: ->{ Person }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /people (people)
  def index
    authorize people
    paginated_people = people.page(params[:page] || 1).per(current_user.limit(:people))

    render inertia: "People/Index", props: {
      people: -> { paginated_people.render(:index) },
      pagination: -> { {
        count: people.count,
        **pagination_data(paginated_people)
      } }
    }
  end

  # @route GET /people/:slug (person)
  def show
    authorize person
    render inertia: "People/Show", props: {
      person: -> { person.render(:show) }
    }
  end

  # @route GET /people/new (new_person)
  def new
    authorize Person.new
    render inertia: "People/New", props: {
      person: Person.new.render(:form_data)
    }
  end

  # @route GET /people/:slug/edit (edit_person)
  def edit
    authorize person
    render inertia: "People/Edit", props: {
      person: person.render(:edit)
    }
  end

  # @route POST /people (people)
  def create
    authorize Person.new
    if person.save
      redirect_to person, notice: "Person was successfully created."
    else
      redirect_to new_person_path, inertia: { errors: person.errors }
    end
  end

  # @route PATCH /people/:slug (person)
  # @route PUT /people/:slug (person)
  def update
    authorize person
    if person.update(person_params)
      redirect_to person, notice: "Person was successfully updated."
    else
      redirect_to edit_person_path, inertia: { errors: person.errors }
    end
  end

  # @route DELETE /people/:slug (person)
  def destroy
    authorize person
    person.destroy!
    redirect_to people_url, notice: "Person was successfully destroyed."
  end

  private

  def sortable_fields
    %w(first_name last_name middle_name nick_name dob created_at updated_at).freeze
  end

  def person_params
    params.require(:person).permit(:person_id, :active_at, :inactive_at, :number)
  end
end
