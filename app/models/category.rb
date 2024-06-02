# == Schema Information
#
# Table name: categories
#
#  id                 :bigint           not null, primary key
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
  pg_search_scope(
    :search,
    against: [:name],
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
    ignoring: :accents,
  )

  slug :slug_from_category_type

  resourcify

  @categorizable_types = %w(Address Email Person Phone User Website)

  validates :name, presence: true, uniqueness: {
    scope: :categorizable_type,
    message: "Category already exists for that category type"
  }
  validates :categorizable_type, presence: true, inclusion: { in: @categorizable_types, allow_nil: false }

  scope :find_by_type, ->(type){ where(categorizable_type: type.to_s.singularize.camelize) }

  scope :includes_associated, -> { includes([]) }

  delegate :to_s, to: :category_with_type

  def category_with_type
    "#{self.categorizable_type} - #{self.name}"
  end

  def slug_from_category_type
    "#{self.categorizable_type}-#{self.name}".downcase
  end

  def records
    self.type.find_by_category(self) # rubocop:disable Rails/DynamicFindBy
  end

  def qty
    records.count
  end

  def type
    self.categorizable_type.constantize
  end
end
