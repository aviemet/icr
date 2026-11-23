# == Schema Information
#
# Table name: client_links
#
#  id         :uuid             not null, primary key
#  title      :string           not null
#  url        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :uuid             not null
#
# Indexes
#
#  index_client_links_on_client_id  (client_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#
FactoryBot.define do
  factory :client_link, class: "Client::Link" do
    client
    title { "Regional Center Portal" }
    url { "https://example.com/portal" }
  end
end
