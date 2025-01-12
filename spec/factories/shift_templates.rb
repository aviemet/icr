# == Schema Information
#
# Table name: shift_templates
#
#  id            :uuid             not null, primary key
#  active        :boolean          default(FALSE), not null
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
    name { "MyString" }
    client { nil }
    created_by { nil }
  end
end
