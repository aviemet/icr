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
class Client::LinkSerializer < ApplicationSerializer
  object_as :link, model: "Client::Link"

  attributes(
    :client_id,
    :title,
    :url,
  )
end
