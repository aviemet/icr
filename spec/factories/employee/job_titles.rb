# == Schema Information
#
# Table name: job_titles
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string           not null
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_job_titles_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :job_title, class: "Employee::JobTitle" do
    name { Faker::Job.title }
    description { Faker::Job.field }
  end
end
