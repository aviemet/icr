module Personable
  extend ActiveSupport::Concern

  included do
    include Identificationable

    belongs_to :person

    accepts_nested_attributes_for :person

    delegate :contact, :name, :first_name, :last_name, to: :person
    alias_method :full_name, :name

    after_initialize :build_default_person

    private

    def build_default_person
      self.person ||= Person.new
    end
  end
end
