import { Stack } from "@/components"
import { Form, Submit } from "@/components/Form"
import { CurrencyInput, DateInput, Select, Textarea, TextInput } from "@/components/Inputs"
import { JobTitlesDropdown } from "@/components/Inputs/Dropdowns"
import { Routes } from "@/lib"

import { OFFER_OPEN_STATUS_OPTIONS, OFFER_PERIOD_OPTIONS } from "./offerOptions"

export interface OfferFormProps {
	employee: Schema.EmployeesShow
}

export function OfferForm({ employee }: OfferFormProps) {
	return (
		<Form
			action={ Routes.employeeOffers(employee.slug) }
			method="post"
			initialData={ {
				offer: {
					job_title_id: employee.desired_job_title_id ?? "",
					rate: "",
					period: employee.desired_compensation_period ?? "hourly",
					proposed_start_on: "",
					employee_number: "",
					status: "draft",
					notes: "",
				},
			} }
		>
			<Stack gap="sm">
				<JobTitlesDropdown name="offer.job_title_id" required />
				<CurrencyInput name="offer.rate" label="Rate" decimalScale={ 2 } required />
				<Select name="offer.period" label="Period" options={ OFFER_PERIOD_OPTIONS } />
				<DateInput name="offer.proposed_start_on" label="Proposed Start" required />
				<TextInput name="offer.employee_number" label="Employee Number" />
				<Select name="offer.status" label="Status" options={ OFFER_OPEN_STATUS_OPTIONS } />
				<Textarea name="offer.notes" label="Notes" minRows={ 2 } />
				<Submit>Add Offer</Submit>
			</Stack>
		</Form>
	)
}
