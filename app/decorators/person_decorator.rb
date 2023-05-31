class PersonDecorator < ApplicationDecorator
  delegate_all

  def full_name
    "#{first_name} #{last_name}"
  end

  private

  def methods_to_serialize
    [:full_name]
  end
end
