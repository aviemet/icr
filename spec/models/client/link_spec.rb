require "rails_helper"

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
RSpec.describe Client::Link, type: :model do
  it "belongs to a client and requires a title" do
    link = build(:client_link, title: nil)
    expect(link).not_to be_valid
    expect(link.errors[:title]).to be_present
  end

  it "rejects urls without a tld" do
    %w[notaurl google localhost https://notaurl http://localhost].each do |url|
      link = build(:client_link, url: url)
      expect(link).not_to be_valid, "expected #{url.inspect} to be invalid"
      expect(link.errors[:url]).to be_present
    end
  end

  it "accepts https urls with a tld" do
    link = build(:client_link, url: "https://example.com/resource")
    expect(link).to be_valid
  end

  it "prepends https when the scheme is missing" do
    link = build(:client_link, url: "www.google.com")
    expect(link).to be_valid
    expect(link.url).to eq("https://www.google.com")
  end

  it "keeps an existing http scheme" do
    link = build(:client_link, url: "http://example.com")
    expect(link).to be_valid
    expect(link.url).to eq("http://example.com")
  end

  it "accepts multi-part tlds" do
    link = build(:client_link, url: "example.co.uk")
    expect(link).to be_valid
    expect(link.url).to eq("https://example.co.uk")
  end
end
