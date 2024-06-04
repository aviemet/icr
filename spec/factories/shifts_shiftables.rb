# == Schema Information
#
# Table name: shifts_shiftables
#
#  id             :bigint           not null, primary key
#  shiftable_type :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  shift_id       :bigint           not null
#  shiftable_id   :bigint           not null
#
# Indexes
#
#  index_shifts_shiftables_on_shift_id   (shift_id)
#  index_shifts_shiftables_on_shiftable  (shiftable_type,shiftable_id)
#
# Foreign Keys
#
#  fk_rails_...  (shift_id => shifts.id)
#
FactoryBot.define do
  factory :shifts_shiftable do
    shift { nil }
    shiftable { nil }
  end
end
