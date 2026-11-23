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
class Client::Link < ApplicationRecord
  self.table_name = "client_links"

  HOST_WITH_TLD = /\A(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}\z/i

  belongs_to :client

  before_validation :normalize_url

  validates :title, presence: true
  validates :url, presence: true
  validate :url_must_be_http_uri_with_tld

  private

  def normalize_url
    return if url.blank?
    return if url.match?(%r{\A[a-z][a-z0-9+\-.]*://}i)

    self.url = "https://#{url.strip}"
  end

  def url_must_be_http_uri_with_tld
    return if url.blank?

    uri = URI.parse(url)
    host = uri.host.to_s
    unless uri.is_a?(URI::HTTP) && host.match?(HOST_WITH_TLD)
      errors.add(:url, :invalid)
    end
  rescue URI::InvalidURIError
    errors.add(:url, :invalid)
  end
end
