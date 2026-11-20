import { useTranslation } from "react-i18next"

import { Box, Section, Text, Title } from "@/components"
import { CountChip } from "@/features"

import * as classes from "./Board.css"

interface FacilitatorRosterProps {
	facilitators: Schema.CaseloadsFacilitator[]
	caseloadCounts: Record<string, number>
	focusedFacilitatorId: string | null
	onFocusFacilitator: (facilitatorId: string) => void
}

export function FacilitatorRoster({
	facilitators,
	caseloadCounts,
	focusedFacilitatorId,
	onFocusFacilitator,
}: FacilitatorRosterProps) {
	const { t } = useTranslation()

	return (
		<Section variant="panel" className={ classes.panel }>
			<Title order={ 4 }>{ t("views.caseloads.roster.title") }</Title>
			{ facilitators.length === 0
				? <Text size="sm" c="dimmed">{ t("views.caseloads.roster.empty") }</Text>
				: (
					<Box className={ classes.list }>
						{ facilitators.map((facilitator) => {
							const count = caseloadCounts[facilitator.id] ?? 0

							return (
								<Box
									key={ facilitator.id }
									className={ classes.rosterRow }
									data-active={ focusedFacilitatorId === facilitator.id }
									onClick={ () => onFocusFacilitator(facilitator.id) }
								>
									<Box style={ { display: "flex", justifyContent: "space-between", gap: 8 } }>
										<Text size="sm" fw={ 600 }>{ facilitator.name }</Text>
										<CountChip value={ count } />
									</Box>
									<Text size="xs" c="dimmed">
										{ t("views.caseloads.roster.caseload_size", { count }) }
									</Text>
								</Box>
							)
						}) }
					</Box>
				) }
		</Section>
	)
}
