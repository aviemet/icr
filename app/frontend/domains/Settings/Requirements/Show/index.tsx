import { useTranslation } from "react-i18next"

import { Stack, Text } from "@/components"
import { FormBand, FormBandStack } from "@/features"

interface RequirementShowDetailsProps {
	requirement: Schema.RequirementRequirementsShow
}

export function RequirementShowDetails({ requirement }: RequirementShowDetailsProps) {
	const { t } = useTranslation()
	const items = requirement.requirement_items ?? []

	return (
		<FormBandStack>
			<FormBand title={ t("views.requirements.show.title") }>
				<Stack gap="xs">
					<Text size="sm">
						{ t("views.requirements.show.type") }: { requirement.type_name || "-" }
					</Text>
					<Text size="sm">
						{ t("views.requirements.show.scope") }: { requirement.scope_label || "-" }
					</Text>
					<Text size="sm">
						{ t("views.requirements.show.enforcement") }:{ " " }
						{ t(`views.requirements.form.enforcement_${requirement.enforcement}`, {
							defaultValue: String(requirement.enforcement ?? "-"),
						}) }
					</Text>
					{ requirement.description && (
						<Text size="sm">
							{ t("views.requirements.show.description") }: { requirement.description }
						</Text>
					) }
				</Stack>
			</FormBand>

			<FormBand title={ t("views.requirements.show.items") }>
				{ items.length === 0
					? <Text size="sm" c="dimmed">{ t("views.requirements.show.no_items") }</Text>
					: (
						<Stack gap="xs">
							{ items.map(item => (
								<Text key={ item.id } size="sm">
									{ item.name } ({ item.kind })
								</Text>
							)) }
						</Stack>
					) }
			</FormBand>
		</FormBandStack>
	)
}
