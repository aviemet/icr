# == Schema Information
#
# Table name: calendar_entry_exceptions
#
#  id                :uuid             not null, primary key
#  cancelled         :datetime
#  ends_at           :datetime
#  rescheduled       :datetime
#  starts_at         :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_entry_id :uuid             not null
#
# Indexes
#
#  index_calendar_entry_exceptions_on_calendar_entry_id  (calendar_entry_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_entry_id => calendar_entries.id)
#
require 'rails_helper'

RSpec.describe Calendar::EntryException do
  # describe "Validations" do

  # end

  describe "Associations" do
    it { is_expected.to belong_to(:calendar_entry) }
  end
end
