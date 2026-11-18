import { useTranslation } from "react-i18next"

import { Badge, Button, Group, Stack, Text, Title } from "@/components"

interface ExemptionsListProps {
	exemptions: Schema.OvertimeExemption[]
	editingId?: string
	onEdit: (exemption: Schema.OvertimeExemption) => void
}

export function ExemptionsList({ exemptions, editingId, onEdit }: ExemptionsListProps) {
	const { t } = useTranslation()

	return (
		<Stack gap="sm">
			<Title order={ 5 }>{ t("views.settings.payroll.overtime_exemptions.list_title") }</Title>

			{ exemptions.length === 0
				? (
					<Text size="sm" c="dimmed">
						{ t("views.settings.payroll.overtime_exemptions.empty") }
					</Text>
				)
				: (
					exemptions.map(exemption => (
						<Group key={ exemption.id } justify="space-between" wrap="nowrap">
							<Group gap="sm">
								<Text fw={ editingId === exemption.id ? 600 : 400 }>
									{ exemption.name }
								</Text>
								<Badge
									variant="light"
									color={ exemption.active ? "green" : "gray" }
									size="sm"
								>
									{ exemption.active
										? t("views.settings.payroll.overtime_exemptions.active")
										: t("views.settings.payroll.overtime_exemptions.inactive") }
								</Badge>
							</Group>
							<Button
								variant="subtle"
								size="compact-sm"
								onClick={ () => onEdit(exemption) }
								disabled={ editingId === exemption.id }
							>
								{ t("views.settings.payroll.overtime_exemptions.edit") }
							</Button>
						</Group>
					))
				) }
		</Stack>
	)
}
