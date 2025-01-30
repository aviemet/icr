module Attachment::Config
  mattr_accessor :image_sizes do
    {
      thumb: [100, 100],
      medium: [300, 300],
      large: [800, 800]
    }
  end

  mattr_accessor :max_image_size do
    5.megabytes
  end

  mattr_accessor :max_document_size do
    10.megabytes
  end

  mattr_accessor :valid_image_types do
    [
      "image/png",
      "image/jpeg",
    ]
  end

  mattr_accessor :valid_document_types do
    [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
  end
end
