# == Schema Information
#
# Table name: categories
#
#  id                 :uuid             not null, primary key
#  categorizable_type :string           not null
#  description        :text
#  name               :string           not null
#  slug               :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  parent_id          :uuid
#
# Indexes
#
#  index_categories_on_name_and_categorizable_type  (name,categorizable_type) UNIQUE
#  index_categories_on_parent_id                    (parent_id)
#  index_categories_on_slug                         (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (parent_id => categories.id)
#
class Category < ApplicationRecord
  extend FriendlyId
  friendly_id :slug_from_category_type

  include PgSearchable
  pg_search_config(against: [:name])

  resourcify

  CATEGORIZABLE_TYPES = %w(Calendar::Event Address Email Phone Website Vendor IncidentReport Identification).freeze

  # Self-referential association to create parent-child relationships
  belongs_to :parent, class_name: "Category", optional: true
  has_many :subcategories, class_name: "Category", foreign_key: "parent_id", dependent: :destroy, inverse_of: :parent

  validates :name, presence: true, uniqueness: {
    scope: :categorizable_type,
    message: I18n.t("categories.validations.uniqueness")
  }
  validates :categorizable_type, presence: true, inclusion: { in: CATEGORIZABLE_TYPES, allow_nil: false }

  scope :type, ->(type){ where(categorizable_type: type.to_s.singularize.camelize) }

  scope :includes_associated, -> { includes([:parent]) }

  def to_s
    "#{categorizable_type.gsub('::', ' ')} - #{name}"
  end

  def records
    self.type.where(category: self)
  end

  def qty
    records.count
  end

  def type
    self.categorizable_type.constantize
  end

  private

  def slug_from_category_type
    "#{self.categorizable_type}-#{self.name}".downcase
  end
end
