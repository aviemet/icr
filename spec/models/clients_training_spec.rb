require "rails_helper"

# == Schema Information
#
# Table name: clients_trainings
#
#  id          :uuid             not null, primary key
#  required    :boolean          default(FALSE), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  client_id   :uuid             not null
#  training_id :uuid             not null
#
# Indexes
#
#  index_clients_trainings_on_client_id                  (client_id)
#  index_clients_trainings_on_client_id_and_training_id  (client_id,training_id) UNIQUE
#  index_clients_trainings_on_training_id                (training_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (training_id => trainings.id)
#
RSpec.describe ClientsTraining do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:clients_training)).to be_valid
    end

    it "defaults required to false" do
      record = create(:clients_training)
      expect(record.required).to be(false)
    end

    it "is invalid when a client has duplicate training records" do
      client = create(:client)
      training = create(:training)
      create(:clients_training, client: client, training: training)

      duplicate = build(:clients_training, client: client, training: training)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:training_id]).to be_present
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:client) }
    it { is_expected.to belong_to(:training).class_name("Employee::Training") }
  end
end
