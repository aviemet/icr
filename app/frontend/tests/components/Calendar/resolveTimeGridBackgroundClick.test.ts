import dayjs from "dayjs"
import { describe, expect, it } from "vitest"

import {
	getTimeGridSlotAnchorBox,
	resolveTimeGridBackgroundClick,
} from "@/components/Calendar/components/TimeGrid/resolveTimeGridBackgroundClick"
import { dayJsLocalizer } from "@/components/Calendar/lib/localizers"

function createContainer(rect: Pick<DOMRect, "left" | "top" | "width" | "height">): HTMLElement {
	const element = document.createElement("div")
	element.getBoundingClientRect = () => ({
		left: rect.left,
		top: rect.top,
		width: rect.width,
		height: rect.height,
		right: rect.left + rect.width,
		bottom: rect.top + rect.height,
		x: rect.left,
		y: rect.top,
		toJSON: () => ({}),
	})
	return element
}

describe("resolveTimeGridBackgroundClick", () => {
	const localizer = dayJsLocalizer(dayjs)
	const monday = new Date(2026, 10, 16)
	const tuesday = new Date(2026, 10, 17)
	const columnHeadings = [
		{ date: monday, resourceId: "resource-a" },
		{ date: tuesday, resourceId: "resource-b" },
	]

	it("emits date, time, and resourceId for the clicked column and slot", () => {
		const container = createContainer({ left: 0, top: 0, width: 200, height: 1440 })
		const timeIncrement = 30
		const rowsPerDay = (24 * 60) / timeIncrement
		const rowHeight = 1440 / rowsPerDay
		const nineAmRow = (9 * 60) / timeIncrement

		const result = resolveTimeGridBackgroundClick({
			clientX: 150,
			clientY: nineAmRow * rowHeight + 1,
			container,
			columnHeadings,
			timeIncrement,
			localizer,
		})

		expect(result).not.toBeNull()
		expect(result!.resourceId).toBe("resource-b")
		expect(result!.columnIndex).toBe(1)
		expect(result!.rowIndex).toBe(nineAmRow)
		expect(localizer.isSame(result!.date, tuesday, "day")).toBe(true)
		expect(result!.time.getHours()).toBe(9)
		expect(result!.time.getMinutes()).toBe(0)
	})

	it("uses the first column for clicks near the left edge", () => {
		const container = createContainer({ left: 100, top: 50, width: 700, height: 480 })

		const result = resolveTimeGridBackgroundClick({
			clientX: 101,
			clientY: 51,
			container,
			columnHeadings,
			timeIncrement: 60,
			localizer,
		})

		expect(result).not.toBeNull()
		expect(result!.resourceId).toBe("resource-a")
		expect(localizer.isSame(result!.date, monday, "day")).toBe(true)
		expect(result!.time.getHours()).toBe(0)
		expect(result!.time.getMinutes()).toBe(0)
	})

	it("returns null when the click is outside the container", () => {
		const container = createContainer({ left: 0, top: 0, width: 200, height: 400 })

		const result = resolveTimeGridBackgroundClick({
			clientX: -1,
			clientY: 10,
			container,
			columnHeadings,
			timeIncrement: 30,
			localizer,
		})

		expect(result).toBeNull()
	})

	it("returns null when there are no column headings", () => {
		const container = createContainer({ left: 0, top: 0, width: 200, height: 400 })

		const result = resolveTimeGridBackgroundClick({
			clientX: 10,
			clientY: 10,
			container,
			columnHeadings: [],
			timeIncrement: 30,
			localizer,
		})

		expect(result).toBeNull()
	})

	it("sizes the slot anchor to the clicked column and draft duration", () => {
		const anchorBox = getTimeGridSlotAnchorBox({
			containerWidth: 200,
			containerHeight: 1440,
			columnCount: 2,
			columnIndex: 1,
			rowIndex: 18,
			timeIncrement: 30,
			durationMinutes: 8 * 60,
		})

		expect(anchorBox).toEqual({
			left: 100,
			top: 18 * 30,
			width: 98,
			height: 16 * 30 - 1,
		})
	})
})
