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
require "rails_helper"

RSpec.describe Person, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
