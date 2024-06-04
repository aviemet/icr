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
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :bigint
#
# Indexes
#
#  index_people_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class PersonSerializer < ApplicationSerializer
  object_as :person

  attributes(
    :first_name,
    :middle_name,
    :last_name,
    :nick_name,
    :user_id,
    name: { type: :string },
  )
end
