# == Schema Information
#
# Table name: job_titles
#
#  id          :uuid             not null, primary key
#  description :text
#  slug        :string           not null
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_job_titles_on_slug  (slug) UNIQUE
#
require 'rails_helper'

RSpec.describe JobTitle do
  pending "add some examples to (or delete) #{__FILE__}"
end
