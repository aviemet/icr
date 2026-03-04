import { useTranslation } from "react-i18next"

import { Table, Text } from "@/components"

const MOCK_PAY_PERIODS = [
	{ pay_period_start: "2024-03-01", pay_period_end: "2024-03-15", label: "Mar 1 - 15, 2024" },
	{ pay_period_start: "2024-02-16", pay_period_end: "2024-02-29", label: "Feb 16 - 29, 2024" },
	{ pay_period_start: "2024-02-01", pay_period_end: "2024-02-15", label: "Feb 1 - 15, 2024" },
]

export default function PayPeriodsTable() {
	const { t } = useTranslation()

	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell>{ t("views.payroll.index.periods.period") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.payroll.index.periods.start") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.payroll.index.periods.end") }</Table.HeadCell>
					<Table.HeadCell className="actions">{ t("views.payroll.index.periods.actions") }</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				{ MOCK_PAY_PERIODS.map(period => (
					<Table.Row key={ `${period.pay_period_start}_${period.pay_period_end}` }>
						<Table.Cell>
							<Text size="sm">{ period.label }</Text>
						</Table.Cell>

						<Table.Cell>
							<Text size="sm">{ new Date(period.pay_period_start).toLocaleDateString() }</Text>
						</Table.Cell>

						<Table.Cell>
							<Text size="sm">{ new Date(period.pay_period_end).toLocaleDateString() }</Text>
						</Table.Cell>

						<Table.Cell>

						</Table.Cell>
					</Table.Row>
				)) }
			</Table.Body>
		</Table>
	)
}
