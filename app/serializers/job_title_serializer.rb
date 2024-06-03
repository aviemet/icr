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
class JobTitleSerializer < ApplicationSerializer
  object_as :job_title

  attributes(
    :title,
    :description,
  )
end
