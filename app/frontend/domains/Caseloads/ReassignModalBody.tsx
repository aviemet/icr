import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button, Group, Stack, Text } from "@/components"
import { TrashIcon } from "@/components/Icons"
import { Select } from "@/components/Inputs"

import { reassignCaseload, unassignCaseload } from "./caseloadMutations"

interface ReassignModalBodyProps {
	client: Schema.CaseloadsClient
	facilitator: Schema.CaseloadsFacilitator
	facilitators: Schema.CaseloadsFacilitator[]
	assignmentId: string
	onClose: () => void
}

export function ReassignModalBody({
	client,
	facilitator,
	facilitators,
	assignmentId,
	onClose,
}: ReassignModalBodyProps) {
	const { t } = useTranslation()
	const [managerId, setManagerId] = useState<string | null>(facilitator.id)
	const [busyAction, setBusyAction] = useState<"reassign" | "unassign" | null>(null)

	const facilitatorOptions = facilitators.map((row) => ({
		value: row.id,
		label: row.name,
	}))

	const busy = busyAction !== null

	const handleUnassign = () => {
		setBusyAction("unassign")
		void unassignCaseload(assignmentId)
			.then(() => {
				onClose()
			})
			.catch(() => {
				setBusyAction(null)
			})
	}

	const handleReassign = () => {
		if(!managerId) return

		if(managerId === facilitator.id) {
			onClose()
			return
		}

		setBusyAction("reassign")
		void reassignCaseload(assignmentId, managerId)
			.then(() => {
				onClose()
			})
			.catch(() => {
				setBusyAction(null)
			})
	}

	return (
		<Stack gap="sm">
			<Text size="sm">
				{ t("views.caseloads.clients.reassign_confirm", {
					client: client.name,
					facilitator: facilitator.name,
				}) }
			</Text>
			<Select
				name="manager_id"
				label={ t("views.caseloads.clients.facilitator_label") }
				options={ facilitatorOptions }
				value={ managerId }
				onChange={ setManagerId }
				searchable
				clearable={ false }
				disabled={ busy }
			/>
			<Group justify="space-between" mt="md">
				<Button
					color="red"
					variant="light"
					leftSection={ <TrashIcon size={ 14 } /> }
					disabled={ busy }
					loading={ busyAction === "unassign" }
					onClick={ handleUnassign }
				>
					{ t("views.caseloads.clients.unassign") }
				</Button>
				<Group>
					<Button
						variant="default"
						disabled={ busy }
						onClick={ onClose }
					>
						{ t("views.caseloads.clients.reassign_cancel") }
					</Button>
					<Button
						color="green"
						disabled={ busy || !managerId }
						loading={ busyAction === "reassign" }
						onClick={ handleReassign }
					>
						{ t("views.caseloads.clients.reassign_confirm_button") }
					</Button>
				</Group>
			</Group>
		</Stack>
	)
}
