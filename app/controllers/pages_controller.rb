class PagesController < ApplicationController
	def home
		render inertia: 'Home',
			props: {
				key: 'value'
			}
	end
end
