class PagesController < ApplicationController
	def home
		render inertia: 'Page/Home',
			props: {
				key: 'value'
			}
	end
end
