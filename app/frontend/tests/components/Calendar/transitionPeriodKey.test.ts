import dayjs from "dayjs"
import { describe, expect, it } from "vitest"

import { transitionPeriodKey } from "@/components/Calendar/lib/CalendarTransitionContainer/transitionPeriodKey"
import { dayJsLocalizer } from "@/components/Calendar/lib/localizers"

const localizer = dayJsLocalizer(dayjs)

describe("transitionPeriodKey", () => {
	it("keeps the same month key when Today stays inside the visible month", () => {
		const midMonth = new Date("2026-11-10T12:00:00.000Z")
		const todayInMonth = new Date("2026-11-21T12:00:00.000Z")

		expect(transitionPeriodKey(midMonth, "month", localizer))
			.toBe(transitionPeriodKey(todayInMonth, "month", localizer))
	})

	it("changes the month key when Today is in another month", () => {
		const october = new Date("2026-10-10T12:00:00.000Z")
		const november = new Date("2026-11-21T12:00:00.000Z")

		expect(transitionPeriodKey(october, "month", localizer))
			.not.toBe(transitionPeriodKey(november, "month", localizer))
	})

	it("keeps the same week key for dates in the same week", () => {
		const monday = new Date("2026-11-16T12:00:00.000Z")
		const wednesday = new Date("2026-11-18T12:00:00.000Z")

		expect(transitionPeriodKey(monday, "week", localizer))
			.toBe(transitionPeriodKey(wednesday, "week", localizer))
	})

	it("uses day precision for day view", () => {
		const morning = new Date("2026-11-21T08:00:00.000Z")
		const evening = new Date("2026-11-21T20:00:00.000Z")
		const nextDay = new Date("2026-11-22T08:00:00.000Z")

		expect(transitionPeriodKey(morning, "day", localizer))
			.toBe(transitionPeriodKey(evening, "day", localizer))
		expect(transitionPeriodKey(morning, "day", localizer))
			.not.toBe(transitionPeriodKey(nextDay, "day", localizer))
	})
})
