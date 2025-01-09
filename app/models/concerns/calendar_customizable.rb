module CalendarCustomizable
  extend ActiveSupport::Concern

  included do
    has_one :calendar_customization, as: :customizer, dependent: :destroy

    before_create :assign_default_color

    def color_mappings
      calendar_customization&.color_mappings || {}
    end

    def set_color(entity_type, entity_id, color)
      customization = calendar_customization || build_calendar_customization
      customization.color_mappings[entity_type.to_s] ||= {}
      customization.color_mappings[entity_type.to_s][entity_id.to_s] = color
      customization.save!
    end

    def color_for(entity_type, entity_id)
      color_mappings.dig(entity_type.to_s, entity_id.to_s)
    end

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
