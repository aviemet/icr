class ApplicationDecorator < Draper::Decorator
  decorates_finders

  def as_json(options = {})
    if defined?(methods_to_serialize)
      options = options.merge({
        methods: methods_to_serialize,
      })
    end
    super(options)
  end
end
