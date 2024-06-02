# == Schema Information
#
# Table name: vendors
#
#  id          :bigint           not null, primary key
#  name        :string
#  notes       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :bigint           not null
#
# Indexes
#
#  index_vendors_on_category_id  (category_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
require 'rails_helper'

RSpec.describe Vendor, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
