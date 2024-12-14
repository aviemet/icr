# == Schema Information
#
# Table name: doctors_clients
#
#  id         :uuid             not null, primary key
#  notes      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :uuid             not null
#  doctor_id  :uuid             not null
#
# Indexes
#
#  index_doctors_clients_on_client_id  (client_id)
#  index_doctors_clients_on_doctor_id  (doctor_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (doctor_id => doctors.id)
#
require 'rails_helper'

RSpec.describe DoctorsClient do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:doctors_client)).to be_valid
    end

    it 'is invlalid with missing attributes' do
      %i().each do |attr|
        expect(build(:doctors_client, attr => nil)).not_to be_valid
      end
    end

  end

  describe "Associations" do
    it{ is_expected.to belong_to(:doctor) }
    it{ is_expected.to belong_to(:client) }
  end
end
