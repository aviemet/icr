module Identificationable
  extend ActiveSupport::Concern

  included do
    has_many :identifications, as: :identificationable, dependent: :nullify
  end
end
