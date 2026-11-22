import { describe, expect, it } from "vitest"

import {
	buildRecurringPatternsAttributes,
	defaultRecurrenceConfig,
	recurrenceConfigFromPatterns,
} from "@/domains/Clients/schedule/EventForm/recurrenceConfig"

describe("defaultRecurrenceConfig", () => {
	it("defaults to weekly on the start weekday with open end", () => {
		const config = defaultRecurrenceConfig("2026-11-16T09:00:00.000Z")
		expect(config.enabled).toBe(false)
		expect(config.frequency).toBe("weekly")
		expect(config.interval).toBe(1)
		expect(config.weekdays).toEqual([new Date("2026-11-16T09:00:00.000Z").getDay()])
		expect(config.ends).toBe("never")
		expect(config.until).toBeNull()
	})
})

describe("recurrenceConfigFromPatterns", () => {
	it("hydrates weekly patterns with an end date", () => {
		expect(recurrenceConfigFromPatterns([
			{ recurring_type: "weekly", offset: 2, day_of_week: 1, end_date: "2026-12-31" },
			{ recurring_type: "weekly", offset: 2, day_of_week: 3, end_date: "2026-12-31" },
		], "2026-11-16T09:00:00.000Z")).toEqual({
			enabled: true,
			frequency: "weekly",
			interval: 2,
			weekdays: [1, 3],
			monthlyMode: "day_of_month",
			ends: "on_date",
			until: "2026-12-31",
			count: 10,
		})
	})

	it("hydrates monthly nth-weekday with occurrence count", () => {
		expect(recurrenceConfigFromPatterns([
			{
				recurring_type: "monthly",
				offset: 1,
				day_of_week: 2,
				week_of_month: 3,
				max_occurrences: 6,
			},
		], "2026-11-16T09:00:00.000Z")).toMatchObject({
			enabled: true,
			frequency: "monthly",
			monthlyMode: "nth_weekday",
			ends: "after",
			count: 6,
		})
	})
})

describe("buildRecurringPatternsAttributes", () => {
	const startsAt = "2026-11-16T09:00:00.000Z"

	it("returns undefined when disabled", () => {
		expect(buildRecurringPatternsAttributes({
			...defaultRecurrenceConfig(startsAt),
			enabled: false,
		}, startsAt)).toBeUndefined()
	})

	it("builds daily patterns", () => {
		expect(buildRecurringPatternsAttributes({
			...defaultRecurrenceConfig(startsAt),
			enabled: true,
			frequency: "daily",
			interval: 2,
			ends: "after",
			count: 5,
		}, startsAt)).toEqual([
			{ recurring_type: "daily", offset: 2, max_occurrences: 5 },
		])
	})

	it("builds one weekly pattern per selected weekday", () => {
		expect(buildRecurringPatternsAttributes({
			...defaultRecurrenceConfig(startsAt),
			enabled: true,
			frequency: "weekly",
			weekdays: [1, 3],
			ends: "on_date",
			until: "2026-11-25",
		}, startsAt)).toEqual([
			{ recurring_type: "weekly", offset: 1, day_of_week: 1, end_date: "2026-11-25" },
			{ recurring_type: "weekly", offset: 1, day_of_week: 3, end_date: "2026-11-25" },
		])
	})

	it("shifts weekly days when the edited occurrence moves to another weekday", () => {
		expect(buildRecurringPatternsAttributes({
			...defaultRecurrenceConfig(startsAt),
			enabled: true,
			frequency: "weekly",
			weekdays: [1],
			ends: "never",
		}, "2026-11-25T09:00:00.000Z", {
			shiftWeekdaysFrom: "2026-11-23T09:00:00.000Z",
		})).toEqual([
			{ recurring_type: "weekly", offset: 1, day_of_week: 3 },
		])
	})

	it("builds monthly day-of-month patterns", () => {
		expect(buildRecurringPatternsAttributes({
			...defaultRecurrenceConfig(startsAt),
			enabled: true,
			frequency: "monthly",
			monthlyMode: "day_of_month",
			ends: "never",
		}, startsAt)).toEqual([
			{
				recurring_type: "monthly",
				offset: 1,
				day_of_month: new Date(startsAt).getDate(),
			},
		])
	})

	it("builds monthly nth-weekday patterns", () => {
		const start = new Date(startsAt)
		expect(buildRecurringPatternsAttributes({
			...defaultRecurrenceConfig(startsAt),
			enabled: true,
			frequency: "monthly",
			monthlyMode: "nth_weekday",
			ends: "never",
		}, startsAt)).toEqual([
			{
				recurring_type: "monthly",
				offset: 1,
				day_of_week: start.getDay(),
				week_of_month: Math.ceil(start.getDate() / 7),
			},
		])
	})

	it("builds yearly patterns", () => {
		const start = new Date(startsAt)
		expect(buildRecurringPatternsAttributes({
			...defaultRecurrenceConfig(startsAt),
			enabled: true,
			frequency: "yearly",
			ends: "never",
		}, startsAt)).toEqual([
			{
				recurring_type: "yearly",
				offset: 1,
				month_of_year: start.getMonth() + 1,
				day_of_month: start.getDate(),
			},
		])
	})
})
