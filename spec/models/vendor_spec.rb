# == Schema Information
#
# Table name: vendors
#
#  id          :uuid             not null, primary key
#  name        :string
#  notes       :text
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid
#
# Indexes
#
#  index_vendors_on_category_id  (category_id)
#  index_vendors_on_slug         (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
require 'rails_helper'

RSpec.describe Vendor do
  pending "add some examples to (or delete) #{__FILE__}"
end
