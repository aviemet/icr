if Rails.env.development?
  ap "Creating Shifts"

  if Shift.count == 0
    4.times do
      FactoryBot.create :shift
    end
  end
end
