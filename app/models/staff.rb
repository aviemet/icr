class Staff < ApplicationRecord
	include Contactable
	
	has_many :shifts
end
