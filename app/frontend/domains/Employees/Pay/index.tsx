import { useTranslation } from "react-i18next"

import { Group, Link, Section, Stack, Text, Title } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, NumberInput, Select, Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

interface EmployeePayProps {
	employee: Schema.EmployeesShow
}

const PERIOD_OPTIONS = [
	{ value: "hourly", label: "Hourly" },
	{ value: "salary", label: "Salary" },
]

export function EmployeePay({ employee }: EmployeePayProps) {
	const { t } = useTranslation()

	return (
		<Stack gap="xl">
			{ employee.current_pay_period_id && (
				<Section>
					<Title order={ 4 } mb="sm">{ t("views.employees.show.pay.payroll") }</Title>
					<Link href={ Routes.periodEmployeeReview(employee.current_pay_period_id, employee.id) }>
						{ t("views.employees.show.pay.view_period_review") }
					</Link>
				</Section>
			) }

			<Section>
				<Title order={ 3 } mb="md">{ t("views.employees.show.pay.rates") }</Title>
				<Stack gap="sm" mb="lg">
					{ employee.pay_rates.map(payRate => (
						<Group key={ payRate.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>
									{ payRate.rate } ({ payRate.period })
								</Text>
								<Text size="sm" c="dimmed">
									{ payRate.starts_at
										? <DateTimeFormatter>{ payRate.starts_at }</DateTimeFormatter>
										: "-" }
									{ " - " }
									{ payRate.ends_at
										? <DateTimeFormatter>{ payRate.ends_at }</DateTimeFormatter>
										: "Current" }
								</Text>
							</Stack>
							<DeleteButton
								href={ Routes.employeePayRate(employee.slug, payRate.id) }
								label={ payRate.rate }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.employees.show.pay.add_rate") }</Title>
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
			</Section>
		</Stack>
	)
}
