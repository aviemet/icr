# == Schema Information
#
# Table name: appointments
#
#  id                :uuid             not null, primary key
#  name              :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#
# Indexes
#
#  index_appointments_on_calendar_event_id  (calendar_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
require 'rails_helper'

RSpec.describe Appointment, type: :model do
  describe 'Validations' do
    it 'is valid with valid attributes' do
      expect(build(:appointment)).to be_valid
    end

    it "is invlalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:appointment, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:calendar_event) }
    it { is_expected.to have_many(:event_participants) }
    it { is_expected.to have_many(:clients) }
    it { is_expected.to have_many(:employees) }
  end

end
