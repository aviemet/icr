class PeopleController < ApplicationController
  include Searchable

  expose :people, -> { search(Person.includes_associated, sortable_fields) }
  expose :person, scope: ->{ Person }, find: ->(id, scope){ scope.includes_associated.find(id) }

  def index
    authorize people
    paginated_people = people.page(params[:page] || 1).per(current_user.limit(:people))

    render inertia: "People/Index", props: {
      people: -> { paginated_people.render(view: :index) },
      pagination: -> { {
        count: people.count,
        **pagination_data(paginated_people)
      } }
    }
  end

  def show
    authorize person
    render inertia: "People/Show", props: {
      person: -> { person.render(view: :show) }
    }
  end

  def new
    authorize Person.new
    render inertia: "People/New", props: {
      person: Person.new.render(view: :form_data)
    }
  end

  def edit
    authorize person
    render inertia: "People/Edit", props: {
      person: person.render(view: :edit)
    }
  end

  def create
    authorize Person.new
    if person.save
      redirect_to person, notice: "Person was successfully created."
    else
      redirect_to new_person_path, inertia: { errors: person.errors }
    end
  end

  def update
    authorize person
    if person.update(person_params)
      redirect_to person, notice: "Person was successfully updated."
    else
      redirect_to edit_person_path, inertia: { errors: person.errors }
    end
  end

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
