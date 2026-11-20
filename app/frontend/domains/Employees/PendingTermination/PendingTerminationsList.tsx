import { useModals } from "@mantine/modals"

import { Box, Button, Link, Text } from "@/components"
import { WarningTriangleIcon } from "@/components/Icons"
import { MetricTile } from "@/features"
import { formatter, Routes } from "@/lib"

import { cancelPendingTermination } from "./cancelPendingTermination"
import * as classes from "./PendingTerminationsList.css"

export interface PendingTerminationsListProps {
	pendingTerminations: Schema.DashboardStatsPendingTermination[]
}

export function PendingTerminationsList({ pendingTerminations }: PendingTerminationsListProps) {
	const modals = useModals()

	if(pendingTerminations.length === 0) return null

	return (
		<MetricTile
			title="Pending terminations"
			tone="alert"
			icon={ <WarningTriangleIcon size={ 16 } /> }
		>
			<Box className={ classes.list }>
				{ pendingTerminations.map((entry) => (
					<Box key={ entry.id } className={ classes.row }>
						<Box className={ classes.meta }>
							<Link href={ Routes.employee(entry.slug) }>{ entry.name }</Link>
							<Text size="sm" c="dimmed">
								{ formatter.datetime.dateTimeLong(entry.inactive_at) }
							</Text>
						</Box>
						<Button
							variant="subtle"
							color="red"
							size="compact-sm"
							onClick={ () => {
								cancelPendingTermination({
									modals,
									employeeSlug: entry.slug,
									employeeName: entry.name,
								})
							} }
						>
							Cancel
						</Button>
					</Box>
				)) }
			</Box>
		</MetricTile>
	)
}
