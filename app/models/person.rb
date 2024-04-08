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
class Person < ApplicationRecord
  include PgSearch::Model
  include PublicActivity::Model
  include Contactable

  multisearchable(
    against: [:first_name, :middle_name, :last_name],
  )

  pg_search_scope(
    :search,
    against: [:first_name, :middle_name, :last_name], associated_against: {
      job_title: [:title],
      manager: [:first_name, :middle_name, :last_name],
      user: [:email],
    }, using: {
      tsearch: { prefix: true },
      trigram: {},
    },
    ignoring: :accents
  )

  enum person_type: { employee: 10, client: 20 }

  belongs_to :user, optional: true
  belongs_to :manager, class_name: "Person", optional: true

  slug :fullast_name

  validates :first_name, presence: true
  validates :last_name, presence: true

  accepts_nested_attributes_for :user
  accepts_nested_attributes_for :contact

  def fullast_name(include_middle_name: false)
    "#{first_name}#{include_middle_name ? " #{middle_name}" : ''} #{last_name}"
  end
end
