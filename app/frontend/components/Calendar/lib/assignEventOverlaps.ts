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

	// Sweep line algorithm
	let group: number[] = []
	let groupEnd: Date | null = null

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
			// Finalize the current group
			group.forEach((idx, slotIndex) => {
				overlapData.set(idx, { slotIndex, groupSize: group.length })
			})
			// Start a new group
			group = [eventIndex]
			groupEnd = displayEnd
		}
	}
	// Finalize the last group
	if(group.length > 0) {
		group.forEach((idx, slotIndex) => {
			overlapData.set(idx, { slotIndex, groupSize: group.length })
		})
	}

	return overlapData
}
