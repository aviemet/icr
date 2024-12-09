# == Schema Information
#
# Table name: doctors
#
#  id         :uuid             not null, primary key
#  first_name :string
#  last_name  :string
#  notes      :text
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_doctors_on_slug  (slug) UNIQUE
#
require 'rails_helper'

RSpec.describe Doctor, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
