import { Checkbox } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { Group, Table, TableProps, Text } from "@/components"
import { formatter } from "@/lib"

interface ReviewTableProps extends TableProps {
	shifts: Schema.ShiftsReview[]
	regularHours: number
	otHours: number
}

function shiftRowHours(shift: Schema.ShiftsReview): number {
	const start = new Date(String(shift.starts_at))
	const end = new Date(String(shift.ends_at))
	return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
}

export default function ReviewTable({ shifts, regularHours, otHours, ...props }: ReviewTableProps) {
	const { t } = useTranslation()

	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell style={ { width: 40 } }>
						<Checkbox size="sm" />
					</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.employee_review.date") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.employee_review.in_out_times") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.employee_review.break") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.employee_review.hours") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.employee_review.exception") }</Table.HeadCell>
				</Table.Row>
			</Table.Head>

			<Table.Body>
				{ shifts.length === 0
					? (
						<Table.Row>
							<Table.Cell colSpan={ 6 }>
								<Text size="sm" c="dimmed">{ t("views.timesheets.employee_review.no_shifts") }</Text>
							</Table.Cell>
						</Table.Row>
					)
					: shifts.map((shift) => {
						const startStr = String(shift.starts_at)
						const endStr = String(shift.ends_at)
						const hours = shiftRowHours(shift)
						const dateWithWeekday = formatter.datetime.dateWithWeekday(startStr)
						const [datePart, weekday] = dateWithWeekday.split(" - ")

						return (
							<Table.Row key={ shift.id }>
								<Table.Cell>
									<Checkbox size="sm" />
								</Table.Cell>
								<Table.Cell>
									<Group gap={ 4 }>
										<Text size="sm">{ datePart }</Text>
										<Text size="sm" c="blue" style={ { textDecoration: "underline" } }>
											{ weekday }
										</Text>
									</Group>
								</Table.Cell>
								<Table.Cell>
									<Text size="sm">
										{ formatter.datetime.timeLong(startStr) } - { formatter.datetime.timeLong(endStr) }
									</Text>
								</Table.Cell>
								<Table.Cell>
									<Text size="sm" c="dimmed">
										{ t("views.timesheets.index.no_value") }
									</Text>
								</Table.Cell>
								<Table.Cell>
									<Text size="sm">{ formatter.number.decimal(hours, 2) }</Text>
								</Table.Cell>
								<Table.Cell>
									<Text size="sm" c="dimmed">
										{ t("views.timesheets.index.no_value") }
									</Text>
								</Table.Cell>
							</Table.Row>
						)
					})
				}
			</Table.Body>

			{ shifts.length > 0 && (
				<Table.Footer>
					<Table.Row>

						<Table.Cell colSpan={ 4 }>
							<Text fw={ 500 }>{ t("views.timesheets.employee_review.total") }</Text>
						</Table.Cell>

						<Table.Cell colSpan={ 2 }>
							<Group gap="md">
								<Text size="sm" fw={ 500 }>
									{ t("views.timesheets.employee_review.footer_regular") }: { formatter.number.decimal(regularHours, 2) } hrs
								</Text>
								<Text size="sm" fw={ 500 }>
									{ t("views.timesheets.employee_review.footer_overtime") }: { formatter.number.decimal(otHours, 2) } hrs
								</Text>
							</Group>
						</Table.Cell>

					</Table.Row>
				</Table.Footer>
			) }
		</Table>
	)
}
