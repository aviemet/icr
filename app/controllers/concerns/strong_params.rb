require "active_support/concern"

module StrongParams
  extend ActiveSupport::Concern

  class_methods do
    def strong_params(name, options = {}, &block)
      param_method_name = :"#{name}_params"

      define_method param_method_name do
        if block_given?
          params.require(name).instance_exec(&block)
        elsif options[:permit].present?
          params.require(name).permit(Array(options[:permit]))
        end
      end
    end

  end
end
