class ShiftDecorator < ApplicationDecorator
  delegate_all

  def title
    "#{starts_at.strftime('%-I %p')} - #{employee.f_name}"
  end

  private

  def methods_to_serialize
    [:title]
  end
end
