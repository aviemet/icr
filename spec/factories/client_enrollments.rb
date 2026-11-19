# == Schema Information
#
# Table name: client_enrollments
#
#  id         :uuid             not null, primary key
#  ends_on    :date
#  notes      :text
#  starts_on  :date             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :uuid             not null
#  vendor_id  :uuid             not null
#
# Indexes
#
#  idx_on_client_id_vendor_id_starts_on_6390a83a5d  (client_id,vendor_id,starts_on)
#  index_client_enrollments_on_client_id            (client_id)
#  index_client_enrollments_on_vendor_id            (vendor_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (vendor_id => vendors.id)
#
FactoryBot.define do
  factory :client_enrollment, class: "Client::Enrollment" do
    client
    vendor
    starts_on { 1.month.ago.to_date }
    notes { "Weekday day program" }
  end
end
