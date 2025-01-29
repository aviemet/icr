module Attachment::HasImages
  extend ActiveSupport::Concern

  included do
    has_many_attached :images do |attachable|
      Attachment::Config.image_sizes.each do |name, dimensions|
        attachable.variant name, resize_to_fill: dimensions
      end
    end

    validates :images,
      content_type: { in: Attachment::Config.valid_image_types, spoofing_protection: true },
      size: { less_than: Attachment::Config.max_image_size },
      if: -> { images.attached? }

  end
end
