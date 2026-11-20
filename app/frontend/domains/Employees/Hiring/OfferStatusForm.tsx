import { Group } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Select } from "@/components/Inputs"
import { Routes } from "@/lib"

import { OFFER_STATUS_OPTIONS } from "./offerOptions"

export interface OfferStatusFormProps {
	employee: Schema.EmployeesShow
	offer: Schema.EmployeeOffersPersisted
}

export function OfferStatusForm({ employee, offer }: OfferStatusFormProps) {
	return (
		<Form
			action={ Routes.employeeOffer(employee.slug, offer.id) }
			method="put"
			initialData={ { offer: { status: offer.status } } }
		>
			<Group wrap="nowrap" gap="xs" align="flex-end">
				<Select name="offer.status" options={ OFFER_STATUS_OPTIONS } size="xs" />
				<Submit size="xs">Update</Submit>
			</Group>
		</Form>
	)
}
