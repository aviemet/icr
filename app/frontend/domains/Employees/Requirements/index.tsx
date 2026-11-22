import { useTranslation } from "react-i18next"

import { Badge, Box, Stack, Text } from "@/components"
import { FormBand, FormBandStack, RecordRow } from "@/features"

import * as classes from "./Requirements.css"
import { type RequirementFulfillmentsPayload } from "./types"

interface EmployeeRequirementsProps {
	fulfillments: RequirementFulfillmentsPayload
}

export function EmployeeRequirements({ fulfillments }: EmployeeRequirementsProps) {
	const { t } = useTranslation()
	const requirements = fulfillments.requirements ?? []

	if(requirements.length === 0) {
		return (
			<FormBandStack>
				<FormBand title={ t("views.employees.show.requirements.empty_title") }>
					<Text size="sm" c="dimmed">{ t("views.employees.show.requirements.empty") }</Text>
				</FormBand>
			</FormBandStack>
		)
	}

	return (
		<FormBandStack>
			<FormBand title={ t("views.employees.show.requirements.summary") }>
				<Text size="sm">
					{ t("views.employees.show.requirements.counts", {
						met: fulfillments.met_count,
						unmet: fulfillments.unmet_count,
						total: fulfillments.total_count,
					}) }
				</Text>
			</FormBand>

			{ requirements.map(requirement => (
				<FormBand
					key={ requirement.requirement_id }
					title={ requirement.name }
					description={ `${requirement.type_name || "-"} - ${requirement.scope_label}` }
				>
					<Box className={ classes.header }>
						<Badge color={ requirement.status === "met" ? "green" : "yellow" } variant="light">
							{ t(`views.employees.show.requirements.status.${requirement.status}`) }
						</Badge>
					</Box>
					{ requirement.items.length === 0
						? <Text size="sm" c="dimmed">{ t("views.employees.show.requirements.no_items") }</Text>
						: (
							<Stack gap="xs">
								{ requirement.items.map(item => (
									<RecordRow
										key={ `${requirement.requirement_id}-${item.kind}-${item.fulfillable_id ?? item.credential_type}` }
										title={ item.name }
										meta={ (
											<Badge
												color={ item.status === "met" ? "green" : "yellow" }
												variant="light"
												size="sm"
											>
												{ t(`views.employees.show.requirements.status.${item.status}`) }
											</Badge>
										) }
									/>
								)) }
							</Stack>
						) }
				</FormBand>
			)) }
		</FormBandStack>
	)
}
