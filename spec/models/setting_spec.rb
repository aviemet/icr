# == Schema Information
#
# Table name: settings
#
#  id              :uuid             not null, primary key
#  data            :jsonb            not null
#  singleton_guard :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_settings_on_singleton_guard  (singleton_guard) UNIQUE
#
require 'rails_helper'

RSpec.describe Setting, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
