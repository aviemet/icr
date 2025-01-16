# == Schema Information
#
# Table name: shift_templates
#
#  id            :uuid             not null, primary key
#  active        :boolean          default(TRUE), not null
#  end_date      :date
#  frequency     :integer
#  name          :string
#  start_date    :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  client_id     :uuid             not null
#  created_by_id :uuid             not null
#
# Indexes
#
#  index_shift_templates_on_client_id      (client_id)
#  index_shift_templates_on_created_by_id  (created_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (created_by_id => users.id)
#
FactoryBot.define do
  factory :shift_template do
    name { "Standard Weekly Schedule" }
    active { true }
    client

    trait :recurring do
      start_date { Date.current }
      end_date { 3.months.from_now.to_date }
      frequency { :weekly }
      active { true }
    end

    trait :inactive do
      active { false }
    end
  end
end
