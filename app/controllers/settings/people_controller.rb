class Settings::PeopleController < ApplicationController
  include Searchable

  expose :people, -> { search(Person.includes_associated) }
  expose :person, id: ->{ params[:slug] }, scope: ->{ Person.includes_associated }, find_by: :slug

  sortable_fields %w[email active first_name last_name number]

  strong_params :person, permit: [:first_name, :last_name, :middle_name, :nick_name, :dob]

  # @route GET /settings/people (settings_people)
  def index
    authorize people

    paginated_people = paginate(people, :people)

    render inertia: "Settings/People/Index", props: {
      people: -> { paginated_people.render(:index) },
      pagination: -> { {
        count: people.count,
        **pagination_data(paginated_people)
      } }
    }
  end

  # @route GET /settings/people/:slug (settings_person)
  def show
    authorize person

    render inertia: "Settings/People/Show", props: {
      person: -> { person.render(:show) }
    }
  end

  # @route GET /settings/people/new (new_settings_person)
  def new
    authorize Person.new

    render inertia: "Settings/People/New", props: {
      person: Person.new.render(:form_data)
    }
  end

  # @route GET /settings/people/:slug/edit (edit_settings_person)
  def edit
    authorize person

    render inertia: "Settings/People/Edit", props: {
      person: person.render(:edit)
    }
  end

  # @route POST /settings/people (settings_people)
  def create
    authorize Person.new
    if person.save
      redirect_to person, notice: "Person was successfully created."
    else
      redirect_to new_person_path, inertia: { errors: person.errors }
    end
  end

  # @route PATCH /settings/people/:slug (settings_person)
  # @route PUT /settings/people/:slug (settings_person)
  def update
    authorize person
    if person.update(person_params)
      redirect_to person, notice: "Person was successfully updated."
    else
      redirect_to edit_person_path, inertia: { errors: person.errors }
    end
  end

  # @route DELETE /settings/people/:slug (settings_person)
  def destroy
    authorize person
    person.destroy!
    redirect_to people_url, notice: "Person was successfully destroyed."
  end
end
