class PersonDecorator < ApplicationDecorator
  delegate_all

  def full_name
    "#{f_name} #{l_name}"
  end

  private

  def methods_to_serialize
    [:full_name]
  end
end
