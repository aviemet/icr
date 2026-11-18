import { ScheduleTable } from "@/domains/Schedules/Table"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"

interface ScheduleIndexProps {
	clients: Schema.ClientsIndex[]
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
			<ScheduleTable records={ clients } model="clients" />
		</IndexPageTemplate>
	)
}

export default Index
