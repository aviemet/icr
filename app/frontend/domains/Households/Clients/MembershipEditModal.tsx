import { useTranslation } from "react-i18next"

import { Modal, Stack } from "@/components"
import { EditButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateInput } from "@/components/Inputs"
import { Routes } from "@/lib"

interface MembershipEditModalProps {
	householdSlug: string
	membership: Schema.HouseholdsClientsPersisted
}

export function MembershipEditModal({
	householdSlug,
	membership,
}: MembershipEditModalProps) {
	const { t } = useTranslation()

	return (
		<Modal
			title={ t("views.households.show.clients.edit") }
			trigger={ <EditButton label={ membership.client.full_name } /> }
		>
			<Form
				action={ Routes.householdMembership(householdSlug, membership.id) }
				method="put"
				initialData={ {
					households_client: {
						starts_at: membership.starts_at ?? "",
					},
				} }
			>
				<Stack gap="sm">
					<DateInput
						name="households_client.starts_at"
						label={ t("views.households.show.clients.starts") }
						required
					/>
					<Submit>{ t("views.households.show.clients.save") }</Submit>
				</Stack>
			</Form>
		</Modal>
	)
}
