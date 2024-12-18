module CalendarCustomizable
  extend ActiveSupport::Concern

  included do
    has_one :calendar_customization, as: :customizer, dependent: :destroy

    before_create :assign_default_color

    # Convenience method to fetch or initialize the color_mappings
    def color_mappings
      calendar_customization&.color_mappings || {}
    end

    # Assigns or updates a color for a specific entity type and ID
    def set_color(entity_type, entity_id, color)
      customization = calendar_customization || build_calendar_customization
      customization.color_mappings[entity_type.to_s] ||= {}
      customization.color_mappings[entity_type.to_s][entity_id.to_s] = color
      customization.save!
    end

    # Retrieves a color for a specific entity type and ID
    def color_for(entity_type, entity_id)
      color_mappings.dig(entity_type.to_s, entity_id.to_s)
    end

    # Removes a color mapping for a specific entity type and ID
    def remove_color(entity_type, entity_id)
      return unless calendar_customization

      if (entity_colors = calendar_customization.color_mappings[entity_type.to_s])
        entity_colors.delete(entity_id.to_s)
        calendar_customization.save!
      end
    end

    private

    def assign_default_color
      self.color ||= ColorGenerator.new(self.class).generate_unique_color
    end
  end
end
