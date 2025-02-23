import dayjs from "dayjs"

export const calendarParams = (start: Date, end: Date, view: string) => {
	let startDay = dayjs(start)

	switch(view) {
		case "month":

			if(startDay.date() !== 1) {
				startDay = startDay.add(1, "week")
			}

			return {
				view,
				year: startDay.year(),
				month: startDay.month() + 1,
			}

		case "week":
			return {
				view,
				date: startDay.format("YYYY-MM-DD"),
			}
		case "day":
			return {
				view,
				date: startDay.format("YYYY-MM-DD"),
			}
		case "agenda":
			return {
				view,
				start: startDay.format("YYYY-MM-DD"),
				end: dayjs(end).format("YYYY-MM-DD"),
			}
		default:
			return { view }
	}
}
