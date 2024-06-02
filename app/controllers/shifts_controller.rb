class ShiftsController < ApplicationController
  include Searchable

  expose :shifts, -> { search(@active_company.shifts.includes_associated, sortable_fields) }
  expose :shift, scope: ->{ @active_company.shifts }, find: ->(id, scope){ scope.includes_associated.find(id) }

  def index
    authorize shifts
    render inertia: "Shift/Index", props: {
      shifts: -> { shifts.render(view: :index) }
    }
  end

  def show
    authorize shift
    render inertia: "Shift/Show", props: {
      shift: -> { shift.render(view: :show) }
    }
  end

  def new
    authorize Shift.new
    render inertia: "Shift/New", props: {
      shift: Shift.new.render(view: :form_data)
    }
  end

  def edit
    authorize shift
    render inertia: "Shift/Edit", props: {
      shift: shift.render(view: :edit)
    }
  end

  def create
    authorize Shift.new
    if shift.save
      redirect_to shift, notice: "Shift was successfully created."
    else
      redirect_to new_shift_path, inertia: { errors: shift.errors }
    end
  end

  def update
    authorize shift
    if shift.update(shift_params)
      redirect_to shift, notice: "Shift was successfully updated."
    else
      redirect_to edit_shift_path, inertia: { errors: shift.errors }
    end
  end

  def destroy
    authorize shift
    shift.destroy!
    redirect_to shifts_url, notice: "Shift was successfully destroyed."
  end

  private

  def sortable_fields
    %w(cal_event_id client_id employee_id household_id).freeze
  end

  def shift_params
    params.require(:shift).permit(:cal_event_id, :client_id, :employee_id, :household_id)
  end
end
