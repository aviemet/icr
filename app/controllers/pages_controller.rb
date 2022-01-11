class PagesController < ApplicationController
	def index
		render inertia: 'Home', props: {
			name: 'World',
		}
	end
end
