# == Schema Information
#
# Table name: trainings
#
#  id                :uuid             not null, primary key
#  active_on         :datetime
#  description       :text
#  estimated_minutes :integer
#  inactive_on       :datetime
#  name              :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
require "rails_helper"

RSpec.describe Employee::Training, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
