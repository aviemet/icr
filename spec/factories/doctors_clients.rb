# == Schema Information
#
# Table name: doctors_clients
#
#  id         :bigint           not null, primary key
#  notes      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :bigint           not null
#  doctor_id  :bigint           not null
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
FactoryBot.define do
  factory :doctors_client do
    doctor { nil }
    client { nil }
    notes { "MyText" }
  end
end
