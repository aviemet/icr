class Client < ApplicationRecord
  include Contactable

  slug :name_for_slug

  validates :f_name, presence: true
  validates :l_name, presence: true

  private

  def name_for_slug
    "#{f_name}-#{l_name}"
  end
end
