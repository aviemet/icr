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
class Person < ApplicationRecord
  include Contactable

  multisearchable(
    against: [:first_name, :middle_name, :last_name],
  )

  pg_search_scope(
    :search,
    against: [:first_name, :middle_name, :last_name, :nick_name], associated_against: {
      user: [:email],
      client: [:number],
      employee: [:number]
    }, using: {
      tsearch: { prefix: true },
      trigram: {},
    },
    ignoring: :accents,
  )

  resourcify

  belongs_to :user, optional: true
  has_one :client, optional: true, dependent: :nullify
  has_one :employee, optional: true, dependent: :nullify

  slug :full_name

  validates :first_name, presence: true
  validates :last_name, presence: true

  accepts_nested_attributes_for :user
  accepts_nested_attributes_for :contact

  scope :includes_associated, -> { includes([:user, :client, :employee, :contact]) }

  def full_name(include_middle_name: false)
    "#{first_name}#{include_middle_name ? " #{middle_name}" : ''} #{last_name}"
  end
end
