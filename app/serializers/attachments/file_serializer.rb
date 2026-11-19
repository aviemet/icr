class Attachments::FileSerializer < ApplicationSerializer
  type :string, optional: false
  delegate :id, to: :@object

  type :string, optional: false
  def filename
    @object.filename.to_s
  end

  type :string, optional: false
  delegate :content_type, to: :@object

  type :number, optional: false
  delegate :byte_size, to: :@object

  type :string, optional: false
  def url
    Rails.application.routes.url_helpers.rails_blob_path(@object, only_path: true)
  end

  type "Date", optional: false
  delegate :created_at, to: :@object
end
