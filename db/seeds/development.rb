if Rails.env == "development"

	if User.count == 0
		user = User.new({
			f_name: "Avram",
			l_name: "Walden",
			email: "aviemet@gmail.com",
			password: "Complex1!",
			confirmed_at: Date.new,
		})
    user.save
	end

end