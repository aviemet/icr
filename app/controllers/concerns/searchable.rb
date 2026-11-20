# frozen_string_literal: true

module Searchable
  extend ActiveSupport::Concern

  CAST_ILIKE_TYPES = %i[date datetime time datetimetz decimal integer float boolean].freeze

  included do
    class_attribute :internal_sortable_fields
    class_attribute :internal_advanced_search_methods
    class_attribute :internal_filterable_fields

    before_action :remove_empty_query_parameters

    ##
    # @param [ActiveRecord::Base] model The model to perform the search on
    # @return [ActiveRecord::Relation] The filtered and sorted relation
    # @example
    #   search(User)
    #
    # Searches and sorts model using search params.
    # Sortable fields in nested models use dot-notation: "related_model.field"
    # To sort by a method on the model class which is not a database field, use `self`: "self.calculated_number"
    def search(model)
      relation = basic_search(model)
      relation = advanced_search(relation)
      relation = apply_filterable_defaults(relation)
      sort(relation, model)
    end

    self.internal_advanced_search_methods = {
      default: ->(model, key, value) { model.where("#{model.table_name}.#{key} ILIKE ?", "%#{value}%") },
      id: ->(model, key, value) { model.joins(key.to_sym).where("#{key.pluralize}.id = ?", value[:id]) },
      created_at: ->(model, _key, value) do
        return model unless value.is_a?(ActionController::Parameters)

        start_date = value[:start]&.to_date&.beginning_of_day
        return model if start_date.nil?

        case value[:type]
        when "before"
          model.where("#{model.table_name}.created_at <= :date", { date: start_date })
        when "after"
          model.where("#{model.table_name}.created_at >= :date", { date: start_date })
        when "exact"
          model.where("#{model.table_name}.created_at = :date", { date: start_date })
        when "range"
          end_date = value[:end]&.to_date&.end_of_day
          return model if end_date.nil?

          model.where("#{model.table_name}.created_at >= :start_date AND #{model.table_name}.created_at <= :end_date", {
            start_date: start_date,
            end_date: end_date,
          })
        end
      end,
    }
    self.internal_filterable_fields = {}

    ##
    # @param [ActiveRecord::Relation] resource The relation to paginate
    # @param [String, nil] key The key used to determine pagination limit from user preferences
    # @return [ActiveRecord::Relation] The paginated relation
    # @example
    #   paginate(User.all, 'users')
    #
    # Apply defaults to the paginate method using user-specific limits
    def paginate(resource, key)
      resource.page(params[:page] || 1).per(key ? current_user.limit(key) : nil)
    end

    # Serialize pagination details for views
    def pagination_data(model)
      return if !model.respond_to? :total_pages

      {
        pages: model.total_pages,
        limit: model.limit_value,
        current_page: model.current_page,
        next_page: model.next_page,
        prev_page: model.prev_page,
        is_first_page: model.first_page?,
        is_last_page: model.last_page?
      }
    end
  end

  class_methods do
    def sortable_fields(fields)
      self.internal_sortable_fields = fields
    end

    def filterable_fields(*args, **kwargs)
      fields = (internal_filterable_fields || {}).dup

      args.each do |name|
        name_sym = name.to_sym
        fields[name_sym] = if name_sym == :created_at
                             { type: :created_at }
                           else
                             { type: :ilike }
                           end
      end

      kwargs.each do |name, config|
        fields[name.to_sym] = normalize_filterable_config(config)
      end

      self.internal_filterable_fields = fields

      unless method_defined?(:advanced_search_params)
        define_method(:advanced_search_params) do
          permit_filterable_fields
        end
      end
    end

    def advanced_search_method(name, callable)
      self.internal_advanced_search_methods = internal_advanced_search_methods.merge(name.to_sym => callable)
    end

    def normalize_filterable_config(config)
      normalized = config.to_h.symbolize_keys
      normalized[:type] ||= :ilike
      normalized
    end
  end

  private

  ##
  # Filters ActiveRecord relation by search params
  ##
  def basic_search(model)
    return model unless params[:search]

    model.search(params[:search])
  end

  ##
  # Filters ActiveRecord relation by advanced search params
  ##
  def advanced_search(model)
    return model unless params[:adv] == "true"
    return model unless defined?(advanced_search_params) == "method"

    advanced_search_params.each do |key, value|
      key_sym = key.to_sym
      config = self.class.internal_filterable_fields&.[](key_sym)

      if config
        model = apply_filterable_field(model, key_sym, value, config)
        next
      end

      methods = internal_advanced_search_methods || {}
      apply_search = methods[key_sym] ||
        (nested_key_with_id?(advanced_search_params[key]) && methods[:id]) ||
        methods[:default]
      next unless apply_search

      model = apply_search.call(model, key, value)
    end

    model
  end

  def apply_filterable_defaults(relation)
    fields = self.class.internal_filterable_fields || {}
    return relation if fields.empty?

    fields.each do |key, config|
      next if config[:default].nil?
      next if params.key?(key) || params.key?(key.to_s)

      default_value = config[:default]
      default_value = default_value.call if default_value.respond_to?(:call)
      relation = apply_filterable_field(relation, key, Array(default_value), config.merge(type: :in))
    end

    relation
  end

  def apply_filterable_field(relation, key, value, config)
    relation = relation.joins(config[:joins]) if config[:joins].present?

    case config[:type]
    when :created_at, :date_range
      apply_date_range_filter(relation, key, value, config)
    when :in
      apply_in_filter(relation, key, value, config)
    when :cast_ilike
      return relation if value.blank?

      column = resolve_filter_column(relation, key, config)
      relation.where("CAST(#{column} AS TEXT) ILIKE ?", "%#{value}%")
    else
      return relation if value.blank?

      column = resolve_filter_column(relation, key, config)
      apply_ilike_filter(relation, key, column, value)
    end
  end

  def apply_date_range_filter(relation, key, value, config)
    return relation unless value.respond_to?(:[])

    start_date = value[:start].presence&.to_date
    return relation if start_date.nil?

    column = resolve_filter_column(relation, key, config)
    field_type = filter_column_type(relation, key, column)
    range_type = value[:type].presence || "range"

    case range_type
    when "before"
      bound = date_range_lower_bound(start_date, field_type)
      relation.where("#{column} <= ?", bound)
    when "after"
      bound = date_range_lower_bound(start_date, field_type)
      relation.where("#{column} >= ?", bound)
    when "exact"
      if field_type == :date
        relation.where("#{column} = ?", start_date)
      else
        relation.where("#{column} >= ? AND #{column} <= ?", start_date.beginning_of_day, start_date.end_of_day)
      end
    when "range"
      end_date = value[:end].presence&.to_date
      return relation if end_date.nil?

      lower = date_range_lower_bound(start_date, field_type)
      upper = date_range_upper_bound(end_date, field_type)
      relation.where("#{column} >= ? AND #{column} <= ?", lower, upper)
    else
      relation
    end
  end

  def date_range_lower_bound(date, field_type)
    field_type == :date ? date : date.beginning_of_day
  end

  def date_range_upper_bound(date, field_type)
    field_type == :date ? date : date.end_of_day
  end

  def apply_in_filter(relation, key, value, config)
    list = Array(value).filter_map { |entry| entry.to_s.presence }
    allowed = resolve_filter_values(config[:values])
    list = list.select { |entry| allowed.include?(entry) } if allowed
    return relation if list.empty?

    column = resolve_filter_column(relation, key, config)
    if column.include?(".")
      relation.where("#{column} IN (?)", list)
    else
      relation.where(column => list)
    end
  end

  def apply_ilike_filter(relation, key, column, value)
    field_type = filter_column_type(relation, key, column)
    if CAST_ILIKE_TYPES.include?(field_type)
      relation.where("CAST(#{column} AS TEXT) ILIKE ?", "%#{value}%")
    else
      relation.where("#{column} ILIKE ?", "%#{value}%")
    end
  end

  def resolve_filter_column(relation, key, config)
    return config[:column].to_s if config[:column].present?

    table_name = relation.klass.table_name
    "#{table_name}.#{key}"
  end

  def resolve_filter_values(values)
    return if values.nil?

    resolved = values.respond_to?(:call) ? values.call : values
    Array(resolved).map(&:to_s)
  end

  def filter_column_type(relation, key, column)
    if column.include?(".")
      table_name, column_name = column.split(".", 2)
      schema_cache = ActiveRecord::Base.connection.schema_cache
      return schema_cache.columns_hash(table_name)&.[](column_name)&.type
    end

    relation.klass.column_for_attribute(key).type
  end

  def permit_filterable_fields
    fields = self.class.internal_filterable_fields || {}
    scalars = []
    arrays = {}
    nested = {}

    fields.each do |name, config|
      case config[:type]
      when :in
        arrays[name] = []
      when :created_at, :date_range
        nested[name] = [:start, :end, :type]
      else
        scalars << name
      end
    end

    params.permit(*scalars, **arrays, **nested)
  end

  def nested_key_with_id?(nested_param)
    nested_param.is_a?(ActionController::Parameters) && nested_param.key?(:id)
  end

  ##
  # Sorts ActiveRecord relation by sort params
  ##
  def sort(obj, model)
    # With empty sort params, don't sort
    return obj unless params[:sort]

    # Sort using db query
    obj.order(sort_string(model))
  end

  ##
  # Returns a string to be used in an `order` statement
  ##
  def sort_string(model)
    return unless self.class.internal_sortable_fields&.include?(params[:sort])

    field_type = get_field_type(model, params[:sort])

    # Don't error if field doesn't exist on model
    return if field_type.nil?

    "#{add_explicit_table_prefix(model, params[:sort].to_s)} #{direction}"
  end

  ##
  # Ensures a sort parameter is scoped to a table name to avoid ambiguous parameter error
  ##
  def add_explicit_table_prefix(model, sort_param)
    if sort_param.include? "."
      return sort_param
    end

    "#{model.table_name}.#{sort_param}"
  end

  ##
  # Returns the data type of a database field
  ##
  def get_field_type(model, column)
    split_fields = column.split(".")

    # if `column` is in the form 'model.field', or further chained such as 'model1.model2.field',
    # ignore the passed `model` param and use the last chained model sent in `column`
    if split_fields.length > 1
      table_name = split_fields[-2]
      column = split_fields[-1]

      schema_cache = ActiveRecord::Base.connection.schema_cache
      return schema_cache.columns_hash(table_name)&.[](column)&.type
    end

    model.column_for_attribute(column).type
  end

  def direction
    %w(asc desc).freeze.include?(params[:direction]) ? params[:direction] : "asc"
  end

  def remove_empty_query_parameters
    # Filter out empty query parameters
    non_empty_params = request.query_parameters.compact_blank

    # Remove direction param if table is not sorted
    if non_empty_params["direction"].present? && non_empty_params["sort"].blank?
      non_empty_params.delete("direction")
    end

    return unless request.query_parameters.keys.length > non_empty_params.keys.length

    # Rebuild the URL without empty query parameters
    new_url = "#{request.path}#{'?' unless non_empty_params.empty?}#{non_empty_params.to_param}"
    redirect_to new_url
  end
end
