import { EventDisplayDetails, TimeGridDisplayProperties } from "@/components/Calendar/lib/displayStrategies"
import { SortedArray } from "@/lib/Collections/SortedArray"

import { EventResources } from ".."

// Calculates overlap positions for timed events in a calendar column
export function assignEventOverlaps<TEventResources extends EventResources>(
	columnEvents: SortedArray<EventDisplayDetails<TEventResources, TimeGridDisplayProperties>>
) {
	const overlapData = new Map<number, { overlapCount: number, sameStartCount: number }>()

	// Build a simple array of event indices from the SortedArray object
	const timedEventIndices: number[] = []
	columnEvents.forEach((eventObj, eventIndex) => {
		if(!eventObj?.event?.allDay) timedEventIndices.push(eventIndex)
	})

	timedEventIndices.forEach((timedEventIndex) => {
		const { displayStart: currStart, displayEnd: currEnd } = columnEvents.get(timedEventIndex).displayProperties

		// Track which overlap slots are already taken by other events
		const overlappingSlots = new Set<number>()
		let hasOverlap = false
		let sameStartCount = 1

		timedEventIndices.forEach((innerTimedEventIndex) => {
			if(timedEventIndex === innerTimedEventIndex) return

			const { displayStart: otherStart, displayEnd: otherEnd } = columnEvents.get(innerTimedEventIndex).displayProperties

			// Check if events overlap in time
			if(currStart < otherEnd && currEnd > otherStart) {
				hasOverlap = true

				if(overlapData.has(innerTimedEventIndex)) {
					overlappingSlots.add(overlapData.get(innerTimedEventIndex)!.overlapCount)
				}
			}

			// Track events which start at the same time
			if(currStart.getTime() === otherStart.getTime()) {
				sameStartCount++
			}
		})

		let overlapCount = 0
		if(hasOverlap) {
			overlapCount = 1
			while(overlappingSlots.has(overlapCount)) overlapCount++
		}

		overlapData.set(timedEventIndex, {
			overlapCount,
			sameStartCount: sameStartCount === 1 ? 0 : sameStartCount,
		})

	})

	return overlapData
}
