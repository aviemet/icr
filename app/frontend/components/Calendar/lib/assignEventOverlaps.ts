import { EventDisplayDetails, TimeGridDisplayProperties } from "@/components/Calendar/lib/displayStrategies"
import { SortedArray } from "@/lib/Collections/SortedArray"

import { EventResources } from ".."

// Assigns slotIndex and groupSize for each event in a column
export function assignEventOverlaps<TEventResources extends EventResources>(
	columnEvents: SortedArray<EventDisplayDetails<TEventResources, TimeGridDisplayProperties>>
) {
	const overlapData = new Map<number, { slotIndex: number, groupSize: number }>()

	// Build a simple array of event indices from the SortedArray object
	const timedEventIndices: number[] = []
	columnEvents.forEach((eventObj, eventIndex) => {
		if(!eventObj?.event?.allDay) timedEventIndices.push(eventIndex)
	})

	let group: number[] = []
	let groupEnd: Date | null = null

	const finalizeGroup = (groupEventIndices: number[]) => {
		if(groupEventIndices.length === 0) return

		const eventIndexToColumn = new Map<number, number>()
		let maxColumnCount = 0

		const active: Array<{ endsAt: Date, columnIndex: number }> = []
		const availableColumns: number[] = []
		let nextNewColumnIndex = 0

		const releaseFinished = (startsAt: Date) => {
			for(let activeIndex = active.length - 1; activeIndex >= 0; activeIndex--) {
				if(active[activeIndex].endsAt > startsAt) continue

				availableColumns.push(active[activeIndex].columnIndex)
				active.splice(activeIndex, 1)
			}

			availableColumns.sort((a, b) => a - b)
			active.sort((a, b) => a.endsAt.getTime() - b.endsAt.getTime())
		}

		groupEventIndices.forEach((eventIndex) => {
			const { displayStart, displayEnd } = columnEvents.get(eventIndex).displayProperties

			releaseFinished(displayStart)

			const columnIndex = availableColumns.shift() ?? nextNewColumnIndex++

			eventIndexToColumn.set(eventIndex, columnIndex)

			active.push({ endsAt: displayEnd, columnIndex })
			maxColumnCount = Math.max(maxColumnCount, active.length)
		})

		groupEventIndices.forEach((eventIndex) => {
			overlapData.set(eventIndex, {
				slotIndex: eventIndexToColumn.get(eventIndex) ?? 0,
				groupSize: maxColumnCount,
			})
		})
	}

	for(let i = 0; i < timedEventIndices.length; i++) {
		const eventIndex = timedEventIndices[i]
		const { displayStart, displayEnd } = columnEvents.get(eventIndex).displayProperties

		if(group.length === 0) {
			group.push(eventIndex)
			groupEnd = displayEnd
			continue
		}

		// If this event starts before the current group's end, it's overlapping
		if(displayStart < groupEnd!) {
			group.push(eventIndex)
			// Extend the group end if this event ends later
			if(displayEnd > groupEnd!) groupEnd = displayEnd
		} else {
			finalizeGroup(group)
			// Start a new group
			group = [eventIndex]
			groupEnd = displayEnd
		}
	}
	finalizeGroup(group)

	return overlapData
}
