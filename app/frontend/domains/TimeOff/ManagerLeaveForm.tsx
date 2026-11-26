import { useTranslation } from "react-i18next"

import { Stack } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DateInput, NumberInput, Select } from "@/components/Inputs"
import { Routes } from "@/lib"

export interface ManagerLeaveFormProps {
	managedEmployees: Schema.EmployeesPersisted[]
}

export function ManagerLeaveForm({ managedEmployees }: ManagerLeaveFormProps) {
	const { t } = useTranslation()

	const kindOptions = [
		{ value: "pto", label: t("views.time_off.index.kind_pto") },
		{ value: "sick", label: t("views.time_off.index.kind_sick") },
	]
	const employeeOptions = managedEmployees.map(employee => ({
		value: employee.id,
		label: employee.full_name ?? employee.name ?? employee.id,
	}))

	return (
		<Form
			action={ Routes.managerLeaveTimeOffRequests() }
			method="post"
			initialData={ {
				time_off_request: {
					employee_id: employeeOptions[0]?.value ?? "",
					kind: "pto",
					starts_at: "",
					hours: 8,
				},
			} }
		>
			<Stack gap="sm">
				<Select
					name="time_off_request.employee_id"
					label={ t("views.time_off.index.employee") }
					options={ employeeOptions }
					searchable
					clearable={ false }
				/>
				<Select
					name="time_off_request.kind"
					label={ t("views.time_off.index.kind") }
					options={ kindOptions }
					searchable={ false }
					clearable={ false }
				/>
				<DateInput name="time_off_request.starts_at" label={ t("views.time_off.index.starts_at") } required />
				<NumberInput
					name="time_off_request.hours"
					label={ t("views.time_off.index.hours") }
					decimalScale={ 2 }
					min={ 0.25 }
					required
				/>
				<Submit>{ t("views.time_off.index.record_leave") }</Submit>
			</Stack>
		</Form>
	)
}
