# == Schema Information
#
# Table name: job_titles
#
#  id          :bigint           not null, primary key
#  description :text
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
require 'rails_helper'

RSpec.describe JobTitle, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
