import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { useFormField } from "@/components/Form"
import { Select } from "@/components/Inputs"
import { type PayrollPeriodType } from "@/types/PayrollPeriodType"

import { PayrollPeriodOptions } from "./PayrollPeriodOptions"

const PAYROLL_PERIOD_VALUES: readonly string[] = ["weekly", "bi_weekly", "semi_monthly", "monthly"]

function isPayrollPeriodType(value: unknown): value is PayrollPeriodType {
	return typeof value === "string" && PAYROLL_PERIOD_VALUES.includes(value)
}

const DEFAULT_PAYROLL_PERIOD: PayrollPeriodType = "bi_weekly"

export function Payroll() {
	const { t } = useTranslation()
	const [payrollPeriod] = useFormField("settings.payroll_period_type")

	return (
		<>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<Select
					name="settings.payroll_period_type"
					label={ t("views.settings.payroll.schedule.period_type_label") }
					options={ [
						{ label: t("views.settings.payroll.schedule.period_type_bi_weekly"), value: "bi_weekly" },
						{ label: t("views.settings.payroll.schedule.period_type_semi_monthly"), value: "semi_monthly" },
						{ label: t("views.settings.payroll.schedule.period_type_monthly"), value: "monthly" },
						{ label: t("views.settings.payroll.schedule.period_type_weekly"), value: "weekly" },
					] }
				/>
			</Grid.Col>

			<Grid.Col>
				<PayrollPeriodOptions payroll_period_type={ isPayrollPeriodType(payrollPeriod) ? payrollPeriod : DEFAULT_PAYROLL_PERIOD } />
			</Grid.Col>
		</>
	)
}
