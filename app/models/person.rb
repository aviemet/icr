# == Schema Information
#
# Table name: people
#
#  id              :uuid             not null, primary key
#  characteristics :jsonb
#  dob             :date
#  first_name      :string
#  last_name       :string
#  middle_name     :string
#  nick_name       :string
#  slug            :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  user_id         :uuid
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

  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  include PgSearchable
  pg_search_config(
    against: [:first_name, :middle_name, :last_name, :nick_name],
    associated_against: {
      user: [:email],
      client: [:number],
      employee: [:number]
    },
  )

  resourcify

  belongs_to :user, optional: true

  has_one :client, dependent: :nullify
  has_one :employee, dependent: :nullify
  has_one :doctor, dependent: :nullify

  validates :first_name, presence: true
  validates :last_name, presence: true

  accepts_nested_attributes_for :user
  accepts_nested_attributes_for :contact

  scope :includes_associated, -> { includes([:user, :client, :employee, :doctor, :contact]) }

  def name(include_middle_name: false)
    "#{first_name}#{include_middle_name ? " #{middle_name}" : ''} #{last_name}"
  end

  def agency_role
    if employee.present?
      "Employee"
    elsif client.present?
      "Client"
    elsif user.present? && (user.has_role?(:admin) || user.has_role?(:super_admin))
      "Administrator"
    else
      ""
    end
  end

  def employee?
    employee.present? && employee.active?
  end

  def client?
    client.present? && client.active?
  end

  def login_enabled?
    user.present? && user.active?
  end
end
