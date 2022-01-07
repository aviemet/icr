class PagesController < InertiaController
	def home
		render inertia: 'Home',
			props: {
				key: 'value'
			}
	end
end
