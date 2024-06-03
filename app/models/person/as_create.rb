# == Schema Information
#
# Table name: people
#
#  id              :bigint           not null, primary key
#  active          :boolean          default(TRUE), not null
#  employee_number :string
#  first_name      :string           not null
#  guid            :string
#  job_title       :string
#  last_name       :string           not null
#  middle_name     :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  location_id     :bigint
#  manager_id      :bigint
#  user_id         :bigint
#
# Indexes
#
#  index_people_on_guid         (guid) UNIQUE
#  index_people_on_location_id  (location_id)
#  index_people_on_manager_id   (manager_id)
#  index_people_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (location_id => locations.id)
#  fk_rails_...  (manager_id => people.id)
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
