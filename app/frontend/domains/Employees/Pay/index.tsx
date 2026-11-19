import { useTranslation } from "react-i18next"

import { Link, Stack } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, NumberInput, Select, Textarea } from "@/components/Inputs"
import {
	CollectionAddModal,
	CollectionPanel,
	MetricTile,
	RecordRow,
} from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

interface EmployeePayProps {
	employee: Schema.EmployeesShow
}

const PERIOD_OPTIONS = [
	{ value: "hourly", label: "Hourly" },
	{ value: "salary", label: "Salary" },
]

export function EmployeePay({ employee }: EmployeePayProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const rates = [...employee.pay_rates].sort((left, right) => {
		const leftTime = left.starts_at ? new Date(left.starts_at).getTime() : 0
		const rightTime = right.starts_at ? new Date(right.starts_at).getTime() : 0
		return rightTime - leftTime
	})

	return (
		<Stack gap="lg">
			{ employee.current_pay_period_id && (
				<MetricTile title={ t("views.employees.show.pay.payroll") }>
					<Link href={ Routes.periodEmployeeReview(employee.current_pay_period_id, employee.id) }>
						{ t("views.employees.show.pay.view_period_review") }
					</Link>
				</MetricTile>
			) }

			<CollectionPanel
				title={ t("views.employees.show.pay.rates") }
				count={ rates.length }
				emptyLabel="No pay rates."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.employees.show.pay.add_rate") }
					>
						<Form
							action={ Routes.employeePayRates(employee.slug) }
							method="post"
							initialData={ {
								pay_rate: {
									rate: "",
									period: "hourly",
									starts_at: "",
									ends_at: "",
									notes: "",
								},
							} }
						>
							<Stack gap="sm">
								<NumberInput name="pay_rate.rate" label="Rate" decimalScale={ 2 } required />
								<Select name="pay_rate.period" label="Period" options={ PERIOD_OPTIONS } />
								<DateInput name="pay_rate.starts_at" label="Starts" />
								<DateInput name="pay_rate.ends_at" label="Ends" />
								<Textarea name="pay_rate.notes" label="Notes" minRows={ 2 } />
								<Submit>Add Pay Rate</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ rates.map(payRate => (
					<RecordRow
						key={ payRate.id }
						title={ `${payRate.rate} (${payRate.period})` }
						meta={ (
							<span>
								{ payRate.starts_at
									? <DateTimeFormatter>{ payRate.starts_at }</DateTimeFormatter>
									: "-" }
								{ " - " }
								{ payRate.ends_at
									? <DateTimeFormatter>{ payRate.ends_at }</DateTimeFormatter>
									: "Current" }
							</span>
						) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.employeePayRate(employee.slug, payRate.id) }
									label={ payRate.rate }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>
		</Stack>
	)
}
