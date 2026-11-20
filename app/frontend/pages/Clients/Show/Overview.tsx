import { ClientOverview } from "@/domains/Clients/Overview"

import { type ShowClientProps } from "."

const Overview = ({
	client,
	can_view_open_shifts = false,
	open_shifts_count = 0,
}: ShowClientProps) => {
	return (
		<ClientOverview
			client={ client }
			canViewOpenShifts={ can_view_open_shifts }
			openShiftsCount={ open_shifts_count }
		/>
	)
}

export default Overview
