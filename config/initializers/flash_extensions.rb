# config/initializers/flash_extension.rb
module ActionDispatch
  class Flash
    class FlashHash
      alias_method :original_write, :[]=

      def []=(key, value)
        if value.is_a?(String)
          value = { id: SecureRandom.uuid, message: value }
        end
        original_write(key, value)
      end

      alias_method :original_read, :[]

      def [](key)
        original_read(key)
      end
    end
  end
end
