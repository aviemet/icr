import { useTranslation } from "react-i18next"

import { Box, Stack, Text, Title } from "@/components"
import { FormBand, FormBandStack } from "@/features"

import { ManagerLeaveForm } from "./ManagerLeaveForm"
import { RequestForm } from "./RequestForm"
import { RequestsTable } from "./RequestsTable"

export interface TimeOffBoardProps {
	myRequests: Schema.TimeOffRequestsIndex[]
	pendingQueue: Schema.TimeOffRequestsIndex[]
	orgPending: Schema.TimeOffRequestsIndex[]
	managedEmployees: Schema.EmployeesPersisted[]
	currentEmployeeId?: string
	canApprove: boolean
	canCreate: boolean
	canManagerLeave: boolean
}

export function TimeOffBoard({
	myRequests,
	pendingQueue,
	orgPending,
	managedEmployees,
	currentEmployeeId,
	canApprove,
	canCreate,
	canManagerLeave,
}: TimeOffBoardProps) {
	const { t } = useTranslation()

	return (
		<Stack gap="lg">
			<Box>
				<Title order={ 2 }>{ t("views.time_off.index.title") }</Title>
				<Text size="sm" c="dimmed" mt={ 4 }>
					{ t("views.time_off.index.description") }
				</Text>
			</Box>

			<FormBandStack>
				{ canCreate && (
					<FormBand title={ t("views.time_off.index.request_title") }>
						<RequestForm />
					</FormBand>
				) }

				{ canManagerLeave && managedEmployees.length > 0 && (
					<FormBand title={ t("views.time_off.index.manager_leave_title") }>
						<ManagerLeaveForm managedEmployees={ managedEmployees } />
					</FormBand>
				) }

				<FormBand title={ t("views.time_off.index.my_requests_title") }>
					<RequestsTable
						requests={ myRequests }
						emptyLabel={ t("views.time_off.index.empty_requests") }
						canCancelOwn
						currentEmployeeId={ currentEmployeeId }
					/>
				</FormBand>

				{ canApprove && (
					<FormBand title={ t("views.time_off.index.pending_queue_title") }>
						<RequestsTable
							requests={ pendingQueue }
							emptyLabel={ t("views.time_off.index.empty_pending") }
							showEmployee
							canApprove
						/>
					</FormBand>
				) }

				{ canApprove && orgPending.length > 0 && (
					<FormBand title={ t("views.time_off.index.org_pending_title") }>
						<RequestsTable
							requests={ orgPending }
							emptyLabel={ t("views.time_off.index.empty_pending") }
							showEmployee
							canApprove
						/>
					</FormBand>
				) }
			</FormBandStack>
		</Stack>
	)
}
