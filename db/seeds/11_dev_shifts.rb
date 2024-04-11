if Rails.env == "development"

	if Shift.count == 0
		4.times do
			FactoryBot.create :shift
		end
	end
end
