import { useModals } from "@mantine/modals"
import { useTranslation } from "react-i18next"

import { Box, Button, Link, Section, Text, Title } from "@/components"
import { confirmBusyAction, RecordRow } from "@/features"
import { Routes } from "@/lib"

import * as classes from "./Board.css"
import { unassignCaseload } from "./caseloadMutations"

interface FacilitatorClientListProps {
	facilitator: Schema.CaseloadsFacilitator | null
	clients: Schema.CaseloadsClient[]
	assignmentsByClientId: Record<string, Schema.CaseloadsAssignment>
}

export function FacilitatorClientList({
	facilitator,
	clients,
	assignmentsByClientId,
}: FacilitatorClientListProps) {
	const { t } = useTranslation()
	const modals = useModals()

	const handleUnassign = (client: Schema.CaseloadsClient) => {
		if(!facilitator) return

		const assignment = assignmentsByClientId[client.id]
		if(!assignment) return

		confirmBusyAction({
			modals,
			title: t("views.caseloads.clients.unassign_title"),
			children: (
				<Text size="sm">
					{ t("views.caseloads.clients.unassign_confirm", {
						client: client.name,
						facilitator: facilitator.name,
					}) }
				</Text>
			),
			confirmLabel: t("views.caseloads.clients.unassign_confirm_button"),
			cancelLabel: t("views.caseloads.clients.unassign_cancel"),
			run: () => unassignCaseload(assignment.id),
		})
	}

	return (
		<Section variant="panel" className={ classes.panel }>
			<Title order={ 4 }>
				{ facilitator
					? `${t("views.caseloads.clients.title")}: ${facilitator.name}`
					: t("views.caseloads.clients.title") }
			</Title>
			{ !facilitator
				? <Text size="sm" c="dimmed">{ t("views.caseloads.roster.select_hint") }</Text>
				: clients.length === 0
					? <Text size="sm" c="dimmed">{ t("views.caseloads.clients.empty") }</Text>
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
											color="red"
											onClick={ () => handleUnassign(client) }
										>
											{ t("views.caseloads.clients.unassign") }
										</Button>
									) }
								/>
							)) }
						</Box>
					) }
		</Section>
	)
}
