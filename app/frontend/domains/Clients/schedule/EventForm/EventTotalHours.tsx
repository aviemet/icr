import dayjs from "dayjs"
import { useForm } from "use-inertia-form"

import { Grid, Text } from "@/components"

import { type EventData } from "."

function parseDateTime(value: Date | string | undefined): dayjs.Dayjs | null {
	if(value === null || value === undefined || value === "") return null

	const d = dayjs(value)
	return d.isValid() ? d : null
}

export function EventTotalHours() {
	const { data } = useForm<EventData>()
	const startsAt = parseDateTime(data.calendar_event?.starts_at)
	const endsAt = parseDateTime(data.calendar_event?.ends_at)

	let label = "—"
	if(startsAt && endsAt) {
		const hours = endsAt.diff(startsAt, "hour", true)
		if(hours < 0) {
			label = "End must be after start"
		} else if(hours % 1 === 0) {
			label = `${hours} hours`
		} else {
			label = `${hours.toFixed(1)} hours`
		}
	}

	return (
		<Grid.Col>
			<Text size="sm" c="dimmed" ta="right">Duration: { label }</Text>
		</Grid.Col>
	)
}
