import { router } from "@inertiajs/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
	Box,
	Button,
	Group,
	Link,
	Presence,
	Section,
	Table,
	Text,
	Title,
} from "@/components"
import { PreviousIcon } from "@/components/Icons"
import { NumberInput } from "@/components/Inputs"
import { formatter, Routes } from "@/lib"

import * as classes from "./Board.css"

export interface IhssAssignmentRow {
	employee_id: string
	employee_name: string
	client_id: string
	client_name: string
	hours: number
	authorized_hours?: number | null
}

export interface IhssAssignmentBoardProps {
	payPeriodSlug: string
	periodDates: [string, string]
	finalized: boolean
	assignmentRows: IhssAssignmentRow[]
}

export function IhssAssignmentBoard({
	payPeriodSlug,
	periodDates,
	finalized,
	assignmentRows,
}: IhssAssignmentBoardProps) {
	const { t } = useTranslation()
	const [periodStart, periodEnd] = periodDates
	const periodRange = periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""
	const [rows, setRows] = useState(assignmentRows)
	const [processing, setProcessing] = useState(false)

	const updateHours = (index: number, hours: number | string) => {
		const next = [...rows]
		const current = next[index]
		if(!current) return

		next[index] = {
			...current,
			hours: typeof hours === "number" ? hours : Number(hours) || 0,
		}
		setRows(next)
	}

	const handleSave = () => {
		setProcessing(true)
		router.patch(
			Routes.ihssPeriod(payPeriodSlug),
			{
				assignments: rows.map(row => ({
					employee_id: row.employee_id,
					client_id: row.client_id,
					hours: row.hours,
				})),
			},
			{
				onFinish: () => setProcessing(false),
			},
		)
	}

	return (
		<Box className={ classes.viewport }>
			<Box className={ classes.board }>
				<Section variant="panel" className={ classes.chrome }>
					<Box className={ classes.identity }>
						<Title order={ 2 }>{ t("views.pay_periods.ihss.title") }</Title>
						{ periodRange && (
							<span className={ classes.subtitle }>{ periodRange }</span>
						) }
						<span className={ classes.subtitle }>
							{ t("views.pay_periods.ihss.help") }
						</span>
					</Box>
				</Section>

				<Section variant="panel" className={ classes.panel }>
					<Table
						data={ rows }
						emptyMessage={ (
							<Text size="sm" c="dimmed">{ t("views.pay_periods.ihss.empty") }</Text>
						) }
					>
						<Table.Head>
							<Table.Row>
								<Table.HeadCell>{ t("views.pay_periods.ihss.employee") }</Table.HeadCell>
								<Table.HeadCell>{ t("views.pay_periods.ihss.client") }</Table.HeadCell>
								<Table.HeadCell>{ t("views.pay_periods.ihss.authorized") }</Table.HeadCell>
								<Table.HeadCell>{ t("views.pay_periods.ihss.hours") }</Table.HeadCell>
							</Table.Row>
						</Table.Head>
						<Table.Body>
							<Table.RowIterator>
								{ (row: IhssAssignmentRow, index) => (
									<Table.Row key={ `${row.employee_id}:${row.client_id}` }>
										<Table.Cell>
											<Text size="sm">{ row.employee_name }</Text>
										</Table.Cell>
										<Table.Cell>
											<Text size="sm">{ row.client_name }</Text>
										</Table.Cell>
										<Table.Cell>
											<Text size="sm"><Presence>{ row.authorized_hours }</Presence></Text>
										</Table.Cell>
										<Table.Cell>
											{ finalized
												? (
													<Text size="sm">{ formatter.number.decimal(row.hours, 2) }</Text>
												)
												: (
													<NumberInput
														name={ `ihss_hours_${row.employee_id}_${row.client_id}` }
														label=""
														value={ row.hours }
														onChange={ (value) => updateHours(index, value ?? 0) }
														decimalScale={ 2 }
														min={ 0 }
													/>
												) }
										</Table.Cell>
									</Table.Row>
								) }
							</Table.RowIterator>
						</Table.Body>
					</Table>
					{ !finalized && rows.length > 0 && (
						<Group mt="md">
							<Button onClick={ handleSave } loading={ processing }>
								{ t("views.pay_periods.ihss.save") }
							</Button>
						</Group>
					) }
				</Section>

				<Group>
					<Link
						as="button"
						href={ Routes.period(payPeriodSlug) }
						variant="default"
						leftSection={ <PreviousIcon size={ 16 } /> }
					>
						{ t("views.pay_periods.ihss.back") }
					</Link>
				</Group>
			</Box>
		</Box>
	)
}
