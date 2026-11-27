import { Box } from "@/components"
import { PendingTerminationsList } from "@/domains/Employees/PendingTermination"

import { ActivityPanel } from "./ActivityPanel"
import * as classes from "./Board.css"
import { Chrome } from "./Chrome"
import { ClientsPanel } from "./ClientsPanel"
import { MySchedulePanel } from "./MySchedulePanel"
import { StaffingPanel } from "./StaffingPanel"
import { TeamPanel } from "./TeamPanel"
import { TimePanel } from "./TimePanel"

interface DashboardBoardProps {
	dashboard: Schema.DashboardStats
}

export function DashboardBoard({ dashboard }: DashboardBoardProps) {
	return (
		<Box className={ classes.viewport }>
			<Box className={ classes.board }>
				<Chrome />

				<Box className={ classes.tileRow }>
					<ClientsPanel dashboard={ dashboard } />
					<TeamPanel dashboard={ dashboard } />
					<TimePanel dashboard={ dashboard } />
				</Box>

				{ dashboard.pending_terminations.length > 0 && (
					<PendingTerminationsList pendingTerminations={ dashboard.pending_terminations } />
				) }

				<Box className={ classes.secondaryRow }>
					<StaffingPanel dashboard={ dashboard } />
					<MySchedulePanel dashboard={ dashboard } />
					<ActivityPanel dashboard={ dashboard } />
				</Box>
			</Box>
		</Box>
	)
}
