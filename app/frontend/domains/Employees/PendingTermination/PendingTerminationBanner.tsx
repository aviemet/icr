import { useModals } from "@mantine/modals"

import { Box, Button, Text } from "@/components"
import { WarningTriangleIcon } from "@/components/Icons"
import { MetricTile } from "@/features"
import { formatter } from "@/lib"

import { cancelPendingTermination } from "./cancelPendingTermination"

export interface PendingTerminationBannerProps {
	employee: Schema.EmployeesShow
	canCancel: boolean
}

export function PendingTerminationBanner({ employee, canCancel }: PendingTerminationBannerProps) {
	const modals = useModals()
	const pendingAt = employee.pending_termination_at
	if(pendingAt === undefined || pendingAt === null) return null

	return (
		<MetricTile
			title="Pending termination"
			tone="alert"
			icon={ <WarningTriangleIcon size={ 16 } /> }
		>
			<Box style={ { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 } }>
				<Text size="sm">
					{ `Scheduled for ${formatter.datetime.dateTimeLong(pendingAt)}.` }
				</Text>
				{ canCancel && (
					<Button
						variant="subtle"
						color="red"
						size="compact-sm"
						onClick={ () => {
							cancelPendingTermination({
								modals,
								employeeSlug: employee.slug,
								employeeName: employee.name,
							})
						} }
					>
						Cancel
					</Button>
				) }
			</Box>
		</MetricTile>
	)
}
