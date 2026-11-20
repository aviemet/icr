import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Box, Section, Title } from "@/components"

import * as classes from "./Board.css"
import { CaseloadMetrics } from "./CaseloadMetrics"
import { FacilitatorClientList } from "./FacilitatorClientList"
import { FacilitatorRoster } from "./FacilitatorRoster"
import { UnassignedClients } from "./UnassignedClients"

export interface CaseloadsBoardProps {
	facilitators: Schema.CaseloadsFacilitator[]
	assignments: Schema.CaseloadsAssignment[]
	clients: Schema.CaseloadsClient[]
	unassigned_clients: Schema.CaseloadsClient[]
	client_ids_by_facilitator: Record<string, string[]>
	caseload_counts: Record<string, number>
	facilitator_count: number
	clients_on_caseload_count: number
	unassigned_count: number
}

export function CaseloadsBoard({
	facilitators,
	assignments,
	clients,
	unassigned_clients,
	client_ids_by_facilitator,
	caseload_counts,
	facilitator_count,
	clients_on_caseload_count,
	unassigned_count,
}: CaseloadsBoardProps) {
	const { t } = useTranslation()
	const [focusedFacilitatorId, setFocusedFacilitatorId] = useState<string | null>(
		facilitators[0]?.id ?? null,
	)

	const clientsById = useMemo(() => {
		return clients.reduce<Record<string, Schema.CaseloadsClient>>((accumulator, client) => {
			accumulator[client.id] = client
			return accumulator
		}, {})
	}, [clients])

	const assignmentsByClientId = useMemo(() => {
		return assignments.reduce<Record<string, Schema.CaseloadsAssignment>>((accumulator, assignment) => {
			accumulator[assignment.client_id] = assignment
			return accumulator
		}, {})
	}, [assignments])

	const focusedFacilitator = facilitators.find((facilitator) => facilitator.id === focusedFacilitatorId) ?? null

	const focusedClients = useMemo(() => {
		if(!focusedFacilitatorId) return []

		const clientIds = client_ids_by_facilitator[focusedFacilitatorId] ?? []
		return clientIds
			.map((clientId) => clientsById[clientId])
			.filter((client): client is Schema.CaseloadsClient => client !== undefined)
	}, [client_ids_by_facilitator, clientsById, focusedFacilitatorId])

	return (
		<Box className={ classes.viewport }>
			<Box className={ classes.board }>
				<Section variant="panel" className={ classes.chrome }>
					<Box className={ classes.identity }>
						<Title order={ 2 }>{ t("views.caseloads.title") }</Title>
						<span className={ classes.subtitle }>{ t("views.caseloads.subtitle") }</span>
					</Box>
				</Section>

				<CaseloadMetrics
					facilitatorCount={ facilitator_count }
					clientsOnCaseloadCount={ clients_on_caseload_count }
					unassignedCount={ unassigned_count }
				/>

				<Box className={ classes.columns }>
					<FacilitatorRoster
						facilitators={ facilitators }
						caseloadCounts={ caseload_counts }
						focusedFacilitatorId={ focusedFacilitatorId }
						onFocusFacilitator={ setFocusedFacilitatorId }
					/>
					<FacilitatorClientList
						facilitator={ focusedFacilitator }
						clients={ focusedClients }
						assignmentsByClientId={ assignmentsByClientId }
					/>
				</Box>

				<UnassignedClients
					clients={ unassigned_clients }
					facilitators={ facilitators }
					focusedFacilitatorId={ focusedFacilitatorId }
				/>
			</Box>
		</Box>
	)
}
