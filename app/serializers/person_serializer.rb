# == Schema Information
#
# Table name: people
#
#  id             :bigint           not null, primary key
#  characterstics :jsonb
#  dob            :date
#  first_name     :string
#  last_name      :string
#  middle_name    :string
#  nick_name      :string
#  slug           :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :bigint
#
# Indexes
#
#  index_people_on_slug     (slug) UNIQUE
#  index_people_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class PersonSerializer < ApplicationSerializer
  object_as :person

  identifier :slug

  attributes(
    :first_name,
    :middle_name,
    :last_name,
    :person_type,
    :user_id,
    :job_title_id,
  )
end
