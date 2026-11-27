import { Box, Link, Text } from "@/components"
import { formatter, Routes } from "@/lib"

import * as classes from "./Board.css"

interface ShiftListItem {
	id: string
	client_name: string
	client_slug: string
	starts_at: string
}

interface ShiftListProps {
	shifts: ShiftListItem[]
	emptyLabel: string
}

export function ShiftList({ shifts, emptyLabel }: ShiftListProps) {
	if(shifts.length === 0) {
		return <Text size="sm" c="dimmed">{ emptyLabel }</Text>
	}

	return (
		<Box className={ classes.list }>
			{ shifts.map((shift) => (
				<Box key={ shift.id } className={ classes.listItem }>
					{ shift.client_slug
						? (
							<Link href={ Routes.scheduleClient(shift.client_slug) }>
								{ shift.client_name }
							</Link>
						)
						: <span>{ shift.client_name }</span> }
					<span className={ classes.listMeta }>
						{ formatter.datetime.timeShort(shift.starts_at) }
					</span>
				</Box>
			)) }
		</Box>
	)
}
