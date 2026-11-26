# frozen_string_literal: true

require "rails_helper"

RSpec.describe Reports::Custom::ClientFaceSheet do
  let(:user) do
    create(:user).tap do |record|
      record.confirm
      record.add_role(:admin)
    end
  end
  let(:client) { create(:client) }
  let(:snapshot) do
    {
      "name" => "Client Face Sheet",
      "slug" => "client-face-sheet",
      "resource_key" => "client_face_sheet",
      "mode" => "custom",
      "format" => "pdf",
    }
  end

  it "builds a PDF for an authorized client" do
    result = described_class.call(
      user: user,
      params: { "client_id" => client.id },
      snapshot: snapshot,
    )

    expect(result[:content_type]).to eq("application/pdf")
    expect(result[:content]).to start_with("%PDF")
    expect(result[:filename]).to include("client-face-sheet")
  end

  it "builds a PDF with an embedded portrait" do
    client.portrait.attach(
      io: Rails.root.join("spec/fixtures/files/sample.png").open,
      filename: "portrait.png",
      content_type: "image/png",
    )

    result = described_class.call(
      user: user,
      params: { "client_id" => client.id },
      snapshot: snapshot,
    )

    expect(result[:content_type]).to eq("application/pdf")
    expect(result[:content]).to start_with("%PDF")
    expect(result[:content].bytesize).to be > 500
  end

  it "rejects an unauthorized client id" do
    other_user = create(:user).tap(&:confirm)

    expect {
      described_class.call(
        user: other_user,
        params: { "client_id" => client.id },
        snapshot: snapshot,
      )
    }.to raise_error(Pundit::NotAuthorizedError)
  end
end
