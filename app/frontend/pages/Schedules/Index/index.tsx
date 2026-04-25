import { IndexPageTemplate } from "@/features"
import { ScheduleTable } from "@/features/Schedules/Table"
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
			pagination={ pagination }
			deleteRoute={ Routes.clients() }
		>
			<ScheduleTable />
		</IndexPageTemplate>
	)
}

export default Index
