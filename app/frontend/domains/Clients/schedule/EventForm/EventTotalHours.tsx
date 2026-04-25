import dayjs from "dayjs"

import { Grid, Text } from "@/components"
import { useFormField } from "@/components/Form/formFieldUtils"

function parseDateTime(value: unknown): dayjs.Dayjs | null {
	if(value === null || value === undefined || value === "") return null

	const d = dayjs(value as string | Date)
	return d.isValid() ? d : null
}

export function EventTotalHours() {
	const [startsAtVal] = useFormField("calendar_event.starts_at")
	const [endsAtVal] = useFormField("calendar_event.ends_at")
	const startsAt = parseDateTime(startsAtVal)
	const endsAt = parseDateTime(endsAtVal)

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
