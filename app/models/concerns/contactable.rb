module Contactable
  extend ActiveSupport::Concern

  included do
    before_validation :ensure_associated_contact

    has_one :contact, as: :contactable, dependent: :destroy
    has_many :addresses, through: :contact
    has_many :phones, through: :contact
    has_many :emails, through: :contact

    accepts_nested_attributes_for :contact, :addresses, :phones, :emails

    private

    def ensure_associated_contact
      build_contact unless contact
    end
  end
end
