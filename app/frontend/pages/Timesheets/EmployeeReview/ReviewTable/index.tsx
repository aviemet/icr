import { Checkbox } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { Group, Table, TableProps, Text } from "@/components"
import { formatter } from "@/lib"

import { ReviewRow } from "./ReviewRow"

interface ReviewTableProps extends TableProps {
	shifts: Schema.ShiftsReview[]
	shiftExceptionReasons?: Record<string, string[]>
	shiftOtHours?: Record<string, number>
	regularHours: number
	otHours: number
	approvalWindowOpen: boolean
	employeeId: string
}

export default function ReviewTable({
	shifts,
	shiftExceptionReasons = {},
	shiftOtHours = {},
	regularHours,
	otHours,
	approvalWindowOpen,
	employeeId,
	...props
}: ReviewTableProps) {
	const { t } = useTranslation()

	return (
		<Table.TableProvider
			rows={ shifts }
			fallbackMessage={ t("views.timesheets.employee_review.no_shifts") }
			hideable={ false }
		>
			<Table { ...props }>
				<Table.Head>
					<Table.Row>
						<Table.HeadCell style={ { width: 40 } }>
							<Checkbox size="sm" />
						</Table.HeadCell>
						<Table.HeadCell>{ t("views.timesheets.employee_review.date") }</Table.HeadCell>
						<Table.HeadCell>{ t("views.timesheets.employee_review.client") }</Table.HeadCell>
						<Table.HeadCell>{ t("views.timesheets.employee_review.in_out_times") }</Table.HeadCell>
						<Table.HeadCell>{ t("views.timesheets.employee_review.hours") }</Table.HeadCell>
						<Table.HeadCell>{ t("views.timesheets.employee_review.ot") }</Table.HeadCell>
						<Table.HeadCell>{ t("views.timesheets.employee_review.exception") }</Table.HeadCell>
					</Table.Row>
				</Table.Head>

				<Table.Body>
					<Table.RowIterator
						render={ (shift: Schema.ShiftsReview) => (
							<ReviewRow
								key={ shift.id }
								shift={ shift }
								shiftExceptionReasons={ shiftExceptionReasons }
								shiftOtHours={ shiftOtHours }
								approvalWindowOpen={ approvalWindowOpen }
								employeeId={ employeeId }
							/>
						) }
					/>
				</Table.Body>

				{ shifts.length > 0 && (
					<Table.Footer>
						<Table.Row>
							<Table.Cell colSpan={ 5 }>
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
		</Table.TableProvider>
	)
}
