import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Select } from "@/components/Inputs"
import { formatter, Routes } from "@/lib"

import { OfferTermsFields } from "./OfferTermsFields"

export interface PromoteFormProps {
	employee: Schema.EmployeesShow
}

const COMMIT_OPTIONS = [
	{ value: "apply", label: "Apply now" },
	{ value: "offer", label: "Create offer" },
]

function currentPayRate(payRates: Schema.EmployeePayRatesPersisted[]) {
	const now = Date.now()

	return [...payRates]
		.filter(payRate => {
			if(!payRate.ends_at) return true
			return new Date(payRate.ends_at).getTime() >= now
		})
		.sort((left, right) => {
			const leftTime = left.starts_at ? new Date(left.starts_at).getTime() : 0
			const rightTime = right.starts_at ? new Date(right.starts_at).getTime() : 0
			return rightTime - leftTime
		})[0] ?? null
}

export function PromoteForm({ employee }: PromoteFormProps) {
	const { t } = useTranslation()
	const [commit, setCommit] = useState<"apply" | "offer">("apply")
	const activePayRate = currentPayRate(employee.pay_rates)
	const currentRateLabel = activePayRate
		? t("views.employees.status.promotion.current_rate", {
			rate: formatter.currency(Number(activePayRate.rate)),
			period: activePayRate.period,
		})
		: undefined

	return (
		<Form
			action={ Routes.employeeOffers(employee.slug) }
			method="post"
			initialData={ {
				return_to: "status",
				offer: {
					job_title_id: employee.job_title?.id ?? "",
					rate: activePayRate?.rate ?? "",
					period: activePayRate?.period ?? "hourly",
					proposed_start_on: "",
					status: "extended",
					commit: "apply",
					notes: "",
				},
			} }
		>
			<Grid>
				<OfferTermsFields
					jobTitleLabel={ t("views.employees.status.promotion.new_job_title") }
					showEmployeeNumber={ false }
					currentRateLabel={ currentRateLabel }
				/>
				<Grid.Col span={ { xxs: 12 } }>
					<Select
						name="offer.commit"
						label={ t("views.employees.status.promotion.commit_label") }
						options={ COMMIT_OPTIONS.map(option => ({
							value: option.value,
							label: t(`views.employees.status.promotion.commit_${option.value}`),
						})) }
						value={ commit }
						onChange={ value => {
							if(value === "apply" || value === "offer") setCommit(value)
						} }
						required
					/>
				</Grid.Col>
				<Grid.Col>
					<Submit>
						{ commit === "offer"
							? t("views.employees.status.promotion.submit_offer")
							: t("views.employees.status.promotion.submit_apply") }
					</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
