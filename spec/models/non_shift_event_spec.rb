# == Schema Information
#
# Table name: non_shift_events
#
#  id                :uuid             not null, primary key
#  name              :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_entry_id :uuid             not null
#
# Indexes
#
#  index_non_shift_events_on_calendar_entry_id  (calendar_entry_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_entry_id => calendar_entries.id)
#
require 'rails_helper'

RSpec.describe NonShiftEvent do
  describe 'Validations' do
    it 'is valid with valid attributes' do
      expect(build(:non_shift_event)).to be_valid
    end

    it "is invlalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:non_shift_event, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:calendar_entry) }
    it { is_expected.to have_many(:event_participants) }
    it { is_expected.to have_many(:clients) }
    it { is_expected.to have_many(:employees) }
  end

end
