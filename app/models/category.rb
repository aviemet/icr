# == Schema Information
#
# Table name: categories
#
#  id                 :uuid             not null, primary key
#  categorizable_type :string           not null
#  description        :text
#  name               :string
#  slug               :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_categories_on_name_and_categorizable_type  (name,categorizable_type) UNIQUE
#  index_categories_on_slug                         (slug) UNIQUE
#
class Category < ApplicationRecord
  extend FriendlyId
  friendly_id :slug_from_category_type

  pg_search_scope(
    :search,
    against: [:name],
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
    ignoring: :accents,
  )

  resourcify

  CATEGORIZABLE_TYPES = %w(Event Address Email Phone Vendor IncidentReport Identification).freeze

  validates :name, presence: true, uniqueness: {
    scope: :categorizable_type,
    message: I18n.t('categories.validations.uniqueness')
  }
  validates :categorizable_type, presence: true, inclusion: { in: CATEGORIZABLE_TYPES, allow_nil: false }

  scope :type, ->(type){ where(categorizable_type: type.to_s.singularize.camelize) }

  scope :includes_associated, -> { includes([]) }

  def to_s
    if attribute_present?("categorizable_type") && attribute_present?("name")
      "#{categorizable_type} - #{name}"
    else
      super
    end
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
