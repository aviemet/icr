# == Schema Information
#
# Table name: incident_types
#
#  id          :uuid             not null, primary key
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid
#
# Indexes
#
#  index_incident_types_on_category_id  (category_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
require 'rails_helper'

RSpec.describe IncidentType do
  pending "add some examples to (or delete) #{__FILE__}"
end
