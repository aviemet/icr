import { cleanup, render, screen } from "@testing-library/react"
import dayjs from "dayjs"
import { beforeEach, describe, expect, it } from "vitest"

import { CalendarProvider } from "@/components/Calendar"
import * as baseEventClasses from "@/components/Calendar/components/Event/Event.css"
import { Event as TimeGridEvent } from "@/components/Calendar/components/TimeGrid/components/Event"
import * as timeGridEventClasses from "@/components/Calendar/components/TimeGrid/components/Event/Event.css"
import { dayJsLocalizer } from "@/components/Calendar/lib/localizers"

const localizer = dayJsLocalizer(dayjs)

interface TestWrapperProps {
	children: React.ReactNode
}

function TestWrapper({ children }: TestWrapperProps) {
	return (
		<CalendarProvider
			value={ {
				date: new Date(),
				events: [],
				draftEvents: [],
				upsertDraftEvent: () => {},
				patchDraftEvent: () => {},
				removeDraftEvent: () => {},
				localizer,
				handleViewChange: () => {},
				handleDateChange: () => {},
				onClick: () => {},
				resourcesById: new Map(),
				groupByResource: false,
				maxEvents: Infinity,
				prevDate: new Date(),
				getEventTitle: (event) => event.title,
			} }
		>
			{ children }
		</CalendarProvider>
	)
}

beforeEach(() => {
	cleanup()
})

describe("TimeGrid event classes", () => {
	it("includes both base and time-grid event classes", () => {
		render(
			<TimeGridEvent
				event={ {
					id: "1",
					title: "Shift",
					start: new Date(),
					end: new Date(),
				} }
				localizer={ localizer }
				displayProperties={ {
					displayStart: new Date(),
					displayEnd: new Date(),
					columnStart: 1,
					columnSpan: 1,
					rowStart: 1,
					rowEnd: 2,
				} }
				startTime={ new Date() }
				timeIncrement={ 30 }
			/>,
			{ wrapper: TestWrapper }
		)

		const eventElement = screen.getByText("Shift").closest("div")
		expect(eventElement).not.toBeNull()
		expect(eventElement).toHaveClass(baseEventClasses.event)
		expect(eventElement).toHaveClass(timeGridEventClasses.timeGridEvent)
	})
})

