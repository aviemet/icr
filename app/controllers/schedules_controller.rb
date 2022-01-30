class SchedulesController < ApplicationController
	def index
		@clients = Client.all
		render inertia: "Schedules/Index", props: {
			clients: @clients
		}
	end
end
