class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  self.implicit_order_column = "created_at"

  # Add .render method to ActiveRecord objects. Located in app/lib/renderable
  include Renderable

  include PublicActivity::Model
  tracked owner: proc { |controller, _model| controller&.current_user || nil }

  include PgSearch::Model
  ##
  # Include a default search scope for overriding
  ##
  pg_search_scope(
    :search,
    against: [],
    using: {
      tsearch: { prefix: true },
      trigram: {},
    },
    ignoring: :accents,
  )

  scope :includes_associated, -> { includes([]) }

  ##
  # Dynamic search scope for terms searching against specific fields
  ##
  def self.dynamic_search(query, field)
    search_scope_name = "#{name.underscore}_#{field}_dynamic_search"

    pg_search_scope(
      search_scope_name,
      against: field,
      using: {
        tsearch: { prefix: true },
        trigram: {},
      },
      ignoring: :accents,
    )

    merge(send(search_scope_name, query))
  end
end
