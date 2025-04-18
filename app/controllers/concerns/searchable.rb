# frozen_string_literal: true

module Searchable
  extend ActiveSupport::Concern

  included do
    class_attribute :internal_sortable_fields

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
      sort(
        advanced_search(basic_search(model)),
        model,
      )
    end

    @advanced_search_methods = {
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
          },)
        end

      end,
    }

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
    return model unless defined?(advanced_search_params) == "method" && params[:adv] = "true"

    advanced_search_params.each do |key, value|
      apply_search = @advanced_search_methods[key.to_sym] ||
        (nested_key_with_id?(advanced_search_params[key]) && @advanced_search_methods[:id]) ||
        @advanced_search_methods[:default]
      next unless apply_search

      model = apply_search.call(model, key, value)
    end

    model
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
      model = split_fields[-2].titleize.singularize.constantize
      column = split_fields[-1]
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
    new_url = "#{request.path}#{non_empty_params.empty? ? '' : '?'}#{non_empty_params.to_param}"
    redirect_to new_url
  end
end
