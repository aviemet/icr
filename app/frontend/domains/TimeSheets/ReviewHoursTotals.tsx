import { Section, Table } from "@/components"
import { formatter } from "@/lib"

import * as classes from "./ReviewHoursTotals.css"

export interface ReviewHoursTotalRow {
	key: string
	label: string
	hours: number
}

interface ReviewHoursTotalsProps {
	rows: ReviewHoursTotalRow[]
	className?: string
}

export function ReviewHoursTotals({ rows, className }: ReviewHoursTotalsProps) {
	return (
		<Section variant="panel" className={ className }>
			<Table.Provider>
				<Table
					className={ classes.table }
					withTableBorder
					withColumnBorders
					withRowBorders
					striped={ false }
					highlightOnHover={ false }
				>
					<Table.Body>
						{ rows.map(row => (
							<Table.Row key={ row.key }>
								<Table.Cell>{ row.label }</Table.Cell>
								<Table.Cell className={ classes.hoursCell } nowrap>
									{ formatter.number.decimal(row.hours, 2) } hrs
								</Table.Cell>
							</Table.Row>
						)) }
					</Table.Body>
				</Table>
			</Table.Provider>
		</Section>
	)
}
