# == Schema Information
#
# Table name: users
#
#  id                     :uuid             not null, primary key
#  active                 :boolean          default(TRUE), not null
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  current_sign_in_at     :datetime
#  current_sign_in_ip     :string
#  email                  :string           not null
#  encrypted_password     :string           not null
#  failed_attempts        :integer          default(0), not null
#  invitation_accepted_at :datetime
#  invitation_created_at  :datetime
#  invitation_limit       :integer
#  invitation_sent_at     :datetime
#  invitation_token       :string
#  invitations_count      :integer          default(0)
#  invited_by_type        :string
#  last_sign_in_at        :datetime
#  last_sign_in_ip        :string
#  locked_at              :datetime
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  sign_in_count          :integer          default(0), not null
#  slug                   :string           not null
#  table_preferences      :jsonb
#  time_zone              :string           default("America/Los_Angeles")
#  unconfirmed_email      :string
#  unlock_token           :string
#  user_preferences       :jsonb
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  invited_by_id          :uuid
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_invitation_token      (invitation_token) UNIQUE
#  index_users_on_invited_by            (invited_by_type,invited_by_id)
#  index_users_on_invited_by_id         (invited_by_id)
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_slug                  (slug) UNIQUE
#  index_users_on_table_preferences     (table_preferences) USING gin
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#  index_users_on_user_preferences      (user_preferences) USING gin
#
require "tzinfo"

class User < ApplicationRecord
  extend FriendlyId
  friendly_id :email, use: [:slugged, :history]

  include PgSearchable
  pg_search_config(against: [:email], enable_multisearch: true)

  rolify
  tracked except: [:reset_password_token, :remember_created_at, :sign_in_count, :last_sign_in_at, :last_sign_in_ip, :confirmation_token, :confirmed_at, :confirmation_sent_at, :unconfirmed_email, :unlock_token, :active_company]

  # Include default devise modules. Others available are:
  #  and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable, :lockable, :timeoutable, :trackable, :recoverable, :rememberable, :validatable

  store_accessor :user_preferences, :dark_mode

  has_one :person, dependent: :nullify

  validates :time_zone, inclusion: { in: TZInfo::Timezone.all_data_zone_identifiers }
  password_complexity_regex = /\A(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,70}\z/
  validates :password, format: { with: password_complexity_regex }, on: [:create, :update], confirmation: true, if: :password

  validates :email, presence: true, uniqueness: true
  validates :email, length: { maximum: 255 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }

  default_scope { includes(:roles) }
  scope :includes_associated, -> { includes([:person]) }

  # Rows page for pagination
  def limit(model)
    self.table_preferences&.[](model.to_s)&.[]("limit")
  end

  before_save :coerce_json
  after_save :synchronize_email_with_contact

  def active?
    active
  end

  # Permission Groups
  has_many :permission_assignments,
    class_name: "Permission::Assignment",
    as: :permissionable,
    dependent: :destroy
  has_many :permission_groups,
    through: :permission_assignments,
    source: :group

  def permissionable_associations
    [
      self,
      person&.employee&.job_title
    ].compact
  end

  def permission?(resource, action, context = {})
    @permission_resolver ||= Permission::Resolver.new(self)
    @permission_resolver.can?(resource, action, context)
  end

  private

  def coerce_json
    self.dark_mode = ActiveModel::Type::Boolean.new.cast(self.dark_mode) if self.dark_mode
  end

  def synchronize_email_with_contact
    return unless person.present? &&
      person.contact.present? &&
      saved_change_to_email?

    person.contact.emails.find_or_create_by!(email: email)
  end
end
