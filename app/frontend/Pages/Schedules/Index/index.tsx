import { IndexPageTemplate } from "@/Features"
import SchedulesTable from "@/Features/Schedules/Table"
import { Routes } from "@/lib"

interface ScheduleIndexProps {
	clients: Schema.Client[]
	pagination: Schema.Pagination
}

const Index = ({ clients, pagination }: ScheduleIndexProps) => {
	return (
		<IndexPageTemplate
			title="Clients"
			model="clients"
			rows={ clients }
			pagination={ pagination }
			deleteRoute={ Routes.clients() }
		>
			<SchedulesTable />
		</IndexPageTemplate>
	)
}

export default Index
