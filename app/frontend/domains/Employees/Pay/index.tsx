import { useTranslation } from "react-i18next"

import { Link, Stack } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { CurrencyFormatter, DateTimeFormatter } from "@/components/Formatters"
import { CurrencyInput, DateInput, Select, Textarea } from "@/components/Inputs"
import {
	CollectionAddModal,
	CollectionPanel,
	MetricTile,
	RecordRow,
} from "@/features"
import { formatter, Routes } from "@/lib"
import { usePermissions, useRecordCanUpdate } from "@/lib/hooks"

interface EmployeePayProps {
	employee: Schema.EmployeesShow
}

const PERIOD_OPTIONS = [
	{ value: "hourly", label: "Hourly" },
	{ value: "salary", label: "Salary" },
]

export function EmployeePay({ employee }: EmployeePayProps) {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const canUpdate = useRecordCanUpdate()
	const canManageTimeOff = can("time_off/requests", "index") ||
		can("time_off/requests", "show") ||
		can("time_off/requests", "create") ||
		can("time_off/requests", "approve")
	const rates = [...employee.pay_rates].sort((left, right) => {
		const leftTime = left.starts_at ? new Date(left.starts_at).getTime() : 0
		const rightTime = right.starts_at ? new Date(right.starts_at).getTime() : 0
		return rightTime - leftTime
	})

	const overtimePolicyOptions = [
		{
			value: "standard",
			label: t("views.employees.show.pay.overtime_policy_standard"),
		},
		{
			value: "personal_attendant",
			label: t("views.employees.show.pay.overtime_policy_personal_attendant"),
		},
	]

	return (
		<Stack gap="lg">
			{ employee.current_pay_period_slug && (
				<MetricTile title={ t("views.employees.show.pay.payroll") }>
					<Link href={ Routes.periodEmployeeReview(employee.current_pay_period_slug, employee.slug) }>
						{ t("views.employees.show.pay.view_period_review") }
					</Link>
				</MetricTile>
			) }

			{ canUpdate && (
				<MetricTile title={ t("views.employees.show.pay.overtime_policy") }>
					<Form
						action={ Routes.employee(employee.slug) }
						method="put"
						initialData={ {
							employee: {
								overtime_policy: employee.overtime_policy ?? "standard",
							},
						} }
					>
						<Stack gap="sm">
							<Select
								name="employee.overtime_policy"
								label={ t("views.employees.show.pay.overtime_policy") }
								description={ t("views.employees.show.pay.overtime_policy_help") }
								options={ overtimePolicyOptions }
							/>
							<Submit>{ t("views.employees.show.pay.save_overtime_policy") }</Submit>
						</Stack>
					</Form>
				</MetricTile>
			) }

			{ canManageTimeOff && (
				<MetricTile title={ t("views.employees.show.pay.time_off") }>
					<Link href={ Routes.timeOffRequests() }>
						{ t("views.employees.show.pay.manage_time_off") }
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
								<CurrencyInput name="pay_rate.rate" label="Rate" decimalScale={ 2 } required />
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
						title={ (
							<>
								<CurrencyFormatter>{ payRate.rate }</CurrencyFormatter>
								{ ` (${payRate.period})` }
							</>
						) }
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
									label={ formatter.currency(payRate.rate) }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>
		</Stack>
	)
}
