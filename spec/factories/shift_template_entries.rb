# == Schema Information
#
# Table name: shift_template_entries
#
#  id                :uuid             not null, primary key
#  day_of_week       :integer
#  ends_at           :time
#  starts_at         :time
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  employee_id       :uuid             not null
#  shift_template_id :uuid             not null
#
# Indexes
#
#  index_shift_template_entries_on_employee_id        (employee_id)
#  index_shift_template_entries_on_shift_template_id  (shift_template_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (shift_template_id => shift_templates.id)
#
FactoryBot.define do
  factory :shift_template_entry do
    day_of_week { 1 }
    starts_at { "08:00:00" }
    ends_at { "16:30:00" }

    employee { nil }
    shift_template
  end
end
