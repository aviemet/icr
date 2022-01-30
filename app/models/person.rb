class Person < ApplicationRecord
  include Contactable

  enum person_type: { employee: 10, client: 20 }

  belongs_to :user, optional: true

  slug :name_for_slug

  validates :f_name, presence: true
  validates :l_name, presence: true

  def name_for_slug
    "#{f_name}-#{l_name}"
  end
end
