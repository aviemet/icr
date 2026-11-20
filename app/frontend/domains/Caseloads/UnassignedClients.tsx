import { useModals } from "@mantine/modals"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

import { Box, Button, Link, Section, Stack, Text, Title } from "@/components"
import { Select } from "@/components/Inputs"
import { confirmBusyAction, RecordRow } from "@/features"
import { Routes } from "@/lib"

import * as classes from "./Board.css"
import { assignCaseload } from "./caseloadMutations"

interface UnassignedClientsProps {
	clients: Schema.CaseloadsClient[]
	facilitators: Schema.CaseloadsFacilitator[]
	focusedFacilitatorId: string | null
}

export function UnassignedClients({
	clients,
	facilitators,
	focusedFacilitatorId,
}: UnassignedClientsProps) {
	const { t } = useTranslation()
	const modals = useModals()
	const managerIdRef = useRef<string | null>(focusedFacilitatorId)

	const facilitatorOptions = facilitators.map((facilitator) => ({
		value: facilitator.id,
		label: facilitator.name,
	}))

	const handleAssign = (client: Schema.CaseloadsClient) => {
		managerIdRef.current = focusedFacilitatorId

		confirmBusyAction({
			modals,
			title: t("views.caseloads.unassigned.assign_title"),
			children: (
				<Stack gap="sm">
					<Text size="sm">
						{ t("views.caseloads.unassigned.assign_confirm", { client: client.name }) }
					</Text>
					<Select
						name="manager_id"
						label={ t("views.caseloads.unassigned.facilitator_label") }
						options={ facilitatorOptions }
						value={ focusedFacilitatorId }
						onChange={ (value) => {
							managerIdRef.current = value
						} }
						searchable
						clearable={ false }
					/>
				</Stack>
			),
			confirmLabel: t("views.caseloads.unassigned.assign_confirm_button"),
			cancelLabel: t("views.caseloads.unassigned.assign_cancel"),
			confirmColor: "blue",
			run: () => {
				const managerId = managerIdRef.current
				if(!managerId) {
					return Promise.reject(new Error(t("views.caseloads.unassigned.pick_facilitator")))
				}

				return assignCaseload(client.id, managerId)
			},
		})
	}

	return (
		<Section variant="panel" className={ classes.panel }>
			<Title order={ 4 }>{ t("views.caseloads.unassigned.title") }</Title>
			{ clients.length === 0
				? <Text size="sm" c="dimmed">{ t("views.caseloads.unassigned.empty") }</Text>
				: (
					<Box className={ classes.list }>
						{ clients.map((client) => (
							<RecordRow
								key={ client.id }
								title={ (
									<Link href={ Routes.client(client.slug) }>{ client.name }</Link>
								) }
								actions={ (
									<Button
										size="compact-xs"
										variant="light"
										onClick={ () => handleAssign(client) }
										disabled={ facilitators.length === 0 }
									>
										{ t("views.caseloads.unassigned.assign") }
									</Button>
								) }
							/>
						)) }
					</Box>
				) }
		</Section>
	)
}
