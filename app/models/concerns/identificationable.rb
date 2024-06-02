module Identificationable
  extend ActiveSupport::Concern

  included do
    has_many :identifications, dependent: :nullify

    accepts_nested_attributes_for :identification
  end
end
