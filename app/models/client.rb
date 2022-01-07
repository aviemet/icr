class Client < ApplicationRecord
	include Contactable

	has_and_belongs_to_many :shifts
end
