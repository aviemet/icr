require "flipper"
require "flipper/adapters/active_record"

Flipper.configure do |config|
  config.adapter { Flipper::Adapters::ActiveRecord.new }
end

Flipper.register(:admins) do |actor|
  actor.respond_to?(:has_role?) && actor.has_role?(:admin)
end
