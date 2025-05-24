import { TimeGridDisplayProperties } from "@/components/Calendar/lib/displayStrategies"

interface EventWithDisplay {
	event: { allDay?: boolean }
	displayProperties: TimeGridDisplayProperties
}

export function assignEventOverlaps(
	columnEvents: { length: number, get(index: number): EventWithDisplay | undefined }
): Map<number, number> {
	const timedEventIndices: number[] = []
	for(let eventIndex = 0; eventIndex < columnEvents.length; eventIndex++) {
		const eventObj = columnEvents.get(eventIndex)
		if(eventObj && !eventObj.event.allDay) timedEventIndices.push(eventIndex)
	}

	const overlapCounts = new Map<number, number>()

	for(let timedEventIndex = 0; timedEventIndex < timedEventIndices.length; timedEventIndex++) {
		const eventIndex = timedEventIndices[timedEventIndex]
		const currEvent = columnEvents.get(eventIndex)
		if(!currEvent) continue
		const currStart = currEvent.displayProperties.displayStart
		const currEnd = currEvent.displayProperties.displayEnd

		const overlappingSlots = new Set<number>()
		let hasOverlap = false

		for(let otherTimedEventIndex = 0; otherTimedEventIndex < timedEventIndices.length; otherTimedEventIndex++) {
			if(timedEventIndex === otherTimedEventIndex) continue
			const otherEventIndex = timedEventIndices[otherTimedEventIndex]
			const otherEvent = columnEvents.get(otherEventIndex)
			if(!otherEvent) continue
			const otherStart = otherEvent.displayProperties.displayStart
			const otherEnd = otherEvent.displayProperties.displayEnd

			if(currStart < otherEnd && currEnd > otherStart) {
				hasOverlap = true
				if(overlapCounts.has(otherEventIndex)) {
					overlappingSlots.add(overlapCounts.get(otherEventIndex)!)
				}
			}
		}

		if(!hasOverlap) {
			overlapCounts.set(eventIndex, 0)
		} else {
			let slot = 1
			while(overlappingSlots.has(slot)) slot++
			overlapCounts.set(eventIndex, slot)
		}
	}

	return overlapCounts
}
