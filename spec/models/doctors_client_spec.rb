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
  pending "add some examples to (or delete) #{__FILE__}"
end
