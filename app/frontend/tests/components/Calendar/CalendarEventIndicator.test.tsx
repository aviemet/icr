import { cleanup, render, screen } from "@testing-library/react"
import dayjs from "dayjs"
import { beforeEach, describe, expect, it } from "vitest"

import { CalendarProvider } from "@/components/Calendar"
import { CalendarEvent } from "@/components/Calendar/components/Event"
import { dayJsLocalizer } from "@/components/Calendar/lib/localizers"

const localizer = dayJsLocalizer(dayjs)

function TestWrapper({ children }: { children: React.ReactNode }) {
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

describe("CalendarEvent indicator", () => {
	it("renders the indicator when label and color exist", () => {
		render(
			<CalendarEvent
				event={ {
					id: "1",
					title: "Shift",
					start: new Date(),
					end: new Date(),
					indicatorLabel: "A",
					indicatorColor: "#ff0000",
				} }
				localizer={ localizer }
				displayProperties={ {
					displayStart: new Date(),
					displayEnd: new Date(),
				} }
			>
				Shift
			</CalendarEvent>,
			{ wrapper: TestWrapper }
		)

		expect(screen.getByText("A")).toBeInTheDocument()
		expect(screen.getByText("Shift")).toBeInTheDocument()
	})

	it("does not render the indicator when missing label or color", () => {
		render(
			<CalendarEvent
				event={ {
					id: "1",
					title: "Shift",
					start: new Date(),
					end: new Date(),
					indicatorColor: "#ff0000",
				} }
				localizer={ localizer }
				displayProperties={ {
					displayStart: new Date(),
					displayEnd: new Date(),
				} }
			>
				Shift
			</CalendarEvent>,
			{ wrapper: TestWrapper }
		)

		expect(screen.queryByText("A")).not.toBeInTheDocument()
		expect(screen.getByText("Shift")).toBeInTheDocument()
	})
})

