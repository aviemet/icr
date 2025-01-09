# == Schema Information
#
# Table name: settings
#
#  id              :uuid             not null, primary key
#  data            :jsonb            not null
#  singleton_guard :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_settings_on_singleton_guard  (singleton_guard) UNIQUE
#
FactoryBot.define do
  factory :setting do
    singelton_guard { 1 }
    data { "" }
  end
end
