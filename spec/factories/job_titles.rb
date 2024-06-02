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
FactoryBot.define do
  factory :job_title do
    title { Faker::Job.title }
    description { Faker::Lorem.paragraph }
  end
end
