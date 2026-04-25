import dayjs from "dayjs"
import { describe, it, expect } from "vitest"

import { ensureDate, isDate, eventsOverlap, nearestHalfHour } from "@/lib/dates"

describe("ensureDate", () => {
	it("returns equivalent Date when given Date", () => {
		const d = new Date("2024-01-15")
		const result = ensureDate(d)
		expect(result).toBeInstanceOf(Date)
		expect(result.getTime()).toBe(d.getTime())
	})

	it("parses valid ISO string to Date", () => {
		const result = ensureDate("2024-01-15T12:00:00.000Z")
		expect(result).toBeInstanceOf(Date)
		expect(result.getFullYear()).toBe(2024)
		expect(result.getMonth()).toBe(0)
		expect(result.getDate()).toBe(15)
	})

	it("parses valid timestamp number to Date", () => {
		const ts = new Date("2024-06-01").getTime()
		const result = ensureDate(ts)
		expect(result).toBeInstanceOf(Date)
		expect(result.getTime()).toBe(ts)
	})

	it("returns new Date() for invalid input", () => {
		const result = ensureDate("not-a-date")
		expect(result).toBeInstanceOf(Date)
	})

	it("returns new Date() for object input", () => {
		const result = ensureDate({})
		expect(result).toBeInstanceOf(Date)
	})
})

describe("isDate", () => {
	it("returns true for Date instance", () => {
		expect(isDate(new Date())).toBe(true)
	})

	it("returns false for string", () => {
		expect(isDate("2024-01-01")).toBe(false)
	})

	it("returns false for null and undefined", () => {
		expect(isDate(null)).toBe(false)
		expect(isDate(undefined)).toBe(false)
	})
})

describe("eventsOverlap", () => {
	it("returns true when events overlap", () => {
		const eventA = { start: new Date("2024-01-01T10:00"), end: new Date("2024-01-01T12:00") }
		const eventB = { start: new Date("2024-01-01T11:00"), end: new Date("2024-01-01T13:00") }
		expect(eventsOverlap(eventA, eventB)).toBe(true)
	})

	it("returns false when events do not overlap", () => {
		const eventA = { start: new Date("2024-01-01T10:00"), end: new Date("2024-01-01T11:00") }
		const eventB = { start: new Date("2024-01-01T12:00"), end: new Date("2024-01-01T13:00") }
		expect(eventsOverlap(eventA, eventB)).toBe(false)
	})

	it("returns true when one event contains the other", () => {
		const eventA = { start: new Date("2024-01-01T09:00"), end: new Date("2024-01-01T14:00") }
		const eventB = { start: new Date("2024-01-01T10:00"), end: new Date("2024-01-01T12:00") }
		expect(eventsOverlap(eventA, eventB)).toBe(true)
	})
})

describe("nearestHalfHour", () => {
	it("rounds to start of hour when minutes < 15", () => {
		const d = new Date("2024-01-01T10:10:00")
		const result = nearestHalfHour(d)
		expect(dayjs(result).minute()).toBe(0)
		expect(dayjs(result).hour()).toBe(10)
	})

	it("rounds to 30 when minutes in 15-44", () => {
		const d = new Date("2024-01-01T10:20:00")
		const result = nearestHalfHour(d)
		expect(dayjs(result).minute()).toBe(30)
		expect(dayjs(result).hour()).toBe(10)
	})

	it("rounds to next hour when minutes >= 45", () => {
		const d = new Date("2024-01-01T10:50:00")
		const result = nearestHalfHour(d)
		expect(dayjs(result).minute()).toBe(0)
		expect(dayjs(result).hour()).toBe(11)
	})
})
