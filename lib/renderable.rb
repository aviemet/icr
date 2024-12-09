module Renderable
  def render(view = nil, options: {})
    serializer(view).render(self, options)
  end

  def serializer(view = nil)
    self.class.serializer_name(view).constantize
  end

  module ClassMethods
    def render(view = nil, options: {})
      serializer(view).render(self, options)
    end

    def serializer(view = nil)
      serializer_name(view).constantize
    end

    def serializer_name(view = nil)
      if view
        "#{name.pluralize.camelize}::#{view.to_s.camelize}Serializer"
      else
        "#{name}Serializer"
      end
    end
  end

  def self.included(base)
    base.extend(ClassMethods)
  end
end
