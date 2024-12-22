# == Schema Information
#
# Table name: doctors
#
#  id         :uuid             not null, primary key
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  person_id  :uuid             not null
#
# Indexes
#
#  index_doctors_on_person_id  (person_id)
#  index_doctors_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class DoctorSerializer < ApplicationSerializer
  identifier :slug

  attributes(
    :first_name,
    :last_name,
    :notes,
  )
end
