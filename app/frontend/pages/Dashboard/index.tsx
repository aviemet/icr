import { Page } from "@/components"
import { DashboardBoard } from "@/domains/Dashboard"

interface DashboardPageProps {
	dashboard: Schema.DashboardStats
}

export default function Dashboard({ dashboard }: DashboardPageProps) {
	return (
		<Page title="Dashboard">
			<DashboardBoard dashboard={ dashboard } />
		</Page>
	)
}
