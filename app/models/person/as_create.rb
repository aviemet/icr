# == Schema Information
#
# Table name: people
#
#  id             :uuid             not null, primary key
#  characterstics :jsonb
#  dob            :date
#  first_name     :string
#  last_name      :string
#  middle_name    :string
#  nick_name      :string
#  slug           :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :uuid
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
class Person::AsCreate < Person
  after_initialize :create_user
  after_initialize :create_contact

  private

  def create_user
    self.user = User.new
  end

  def create_contact
    self.contact = Contact.new
    self.contact.emails << Email.new
  end

end
