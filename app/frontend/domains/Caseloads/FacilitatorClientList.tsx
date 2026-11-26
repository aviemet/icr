import { useModals } from "@mantine/modals"
import { useTranslation } from "react-i18next"

import { Box, Button, Link, Section, Text, Title } from "@/components"
import { RecordRow } from "@/features"
import { Routes } from "@/lib"

import * as classes from "./Board.css"
import { ReassignModalBody } from "./ReassignModalBody"

interface FacilitatorClientListProps {
	facilitator: Schema.CaseloadsFacilitator | null
	facilitators: Schema.CaseloadsFacilitator[]
	clients: Schema.CaseloadsClient[]
	assignmentsByClientId: Record<string, Schema.CaseloadsAssignment>
}

export function FacilitatorClientList({
	facilitator,
	facilitators,
	clients,
	assignmentsByClientId,
}: FacilitatorClientListProps) {
	const { t } = useTranslation()
	const modals = useModals()

	const handleReassign = (client: Schema.CaseloadsClient) => {
		if(!facilitator) return

		const assignment = assignmentsByClientId[client.id]
		if(!assignment) return

		modals.openModal({
			title: t("views.caseloads.clients.reassign_title"),
			children: (
				<ReassignModalBody
					client={ client }
					facilitator={ facilitator }
					facilitators={ facilitators }
					assignmentId={ assignment.id }
					onClose={ () => modals.closeAll() }
				/>
			),
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
											onClick={ () => handleReassign(client) }
										>
											{ t("views.caseloads.clients.reassign") }
										</Button>
									) }
								/>
							)) }
						</Box>
					) }
		</Section>
	)
}
