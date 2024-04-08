# == Schema Information
#
# Table name: people
#
#  id           :bigint           not null, primary key
#  first_name   :string
#  last_name    :string
#  middle_name  :string
#  person_type  :integer
#  slug         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  job_title_id :bigint
#  user_id      :bigint
#
# Indexes
#
#  index_people_on_job_title_id  (job_title_id)
#  index_people_on_slug          (slug) UNIQUE
#  index_people_on_user_id       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (job_title_id => job_titles.id)
#  fk_rails_...  (user_id => users.id)
#
class EmployeeSerializer < ApplicationSerializer
  object_as :employee

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
