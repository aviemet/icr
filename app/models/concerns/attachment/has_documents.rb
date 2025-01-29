module Attachment::HasDocuments
  extend ActiveSupport::Concern

  VALID_DOCUMENT_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ].freeze

  included do
    has_many_attached :documents

    validates :documents,
      content_type: { in: Attachment::Config.valid_document_types },
      size: { less_than: Attachment::Config.max_document_size },
      if: -> { documents.attached? }

    def document_count
      documents.count
    end
  end
end
