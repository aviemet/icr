import { type CalendarLocalizer } from "@/components/Calendar/lib/localizers"

export interface TimeGridBackgroundClickHeading {
	date: Date
	resourceId?: string | number
}

export interface ResolveTimeGridBackgroundClickArgs {
	clientX: number
	clientY: number
	container: HTMLElement
	columnHeadings: TimeGridBackgroundClickHeading[]
	timeIncrement: number
	localizer: CalendarLocalizer
}

export interface TimeGridBackgroundClickResult {
	date: Date
	time: Date
	resourceId?: string | number
	columnIndex: number
	rowIndex: number
}

export interface TimeGridSlotAnchorBox {
	left: number
	top: number
	width: number
	height: number
}

export interface GetTimeGridSlotAnchorBoxArgs {
	containerWidth: number
	containerHeight: number
	columnCount: number
	columnIndex: number
	rowIndex: number
	timeIncrement: number
	durationMinutes?: number
}

export function getTimeGridSlotAnchorBox({
	containerWidth,
	containerHeight,
	columnCount,
	columnIndex,
	rowIndex,
	timeIncrement,
	durationMinutes = 8 * 60,
}: GetTimeGridSlotAnchorBoxArgs): TimeGridSlotAnchorBox | null {
	if(columnCount <= 0 || containerWidth <= 0 || containerHeight <= 0) return null

	const rowsPerDay = (24 * 60) / timeIncrement
	if(rowIndex < 0 || rowIndex >= rowsPerDay) return null
	if(columnIndex < 0 || columnIndex >= columnCount) return null

	const columnWidth = containerWidth / columnCount
	const rowHeight = containerHeight / rowsPerDay
	const durationRows = Math.max(1, Math.min(
		Math.ceil(durationMinutes / timeIncrement),
		rowsPerDay - rowIndex,
	))

	return {
		left: columnIndex * columnWidth,
		top: rowIndex * rowHeight,
		width: Math.max(0, columnWidth - 2),
		height: Math.max(0, durationRows * rowHeight - 1),
	}
}

export function resolveTimeGridBackgroundClick({
	clientX,
	clientY,
	container,
	columnHeadings,
	timeIncrement,
	localizer,
}: ResolveTimeGridBackgroundClickArgs): TimeGridBackgroundClickResult | null {
	if(columnHeadings.length === 0) return null

	const rect = container.getBoundingClientRect()
	if(rect.width <= 0 || rect.height <= 0) return null

	const offsetX = clientX - rect.left
	const offsetY = clientY - rect.top
	if(offsetX < 0 || offsetY < 0 || offsetX > rect.width || offsetY > rect.height) {
		return null
	}

	const columnCount = columnHeadings.length
	const columnIndex = Math.min(
		columnCount - 1,
		Math.max(0, Math.floor((offsetX / rect.width) * columnCount)),
	)
	const heading = columnHeadings[columnIndex]
	if(!heading) return null

	const rowsPerDay = (24 * 60) / timeIncrement
	const rowIndex = Math.min(
		rowsPerDay - 1,
		Math.max(0, Math.floor((offsetY / rect.height) * rowsPerDay)),
	)
	const minutesFromStart = rowIndex * timeIncrement
	const date = localizer.startOf(heading.date, "day")
	const time = localizer.add(date, minutesFromStart, "minute")

	return {
		date,
		time,
		resourceId: heading.resourceId,
		columnIndex,
		rowIndex,
	}
}
