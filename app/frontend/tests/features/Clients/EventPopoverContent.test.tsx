import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, screen } from "@testing-library/react"
import dayjs from "dayjs"
import { beforeEach, describe, expect, it } from "vitest"

import { CalendarProvider } from "@/components/Calendar"
import { dayJsLocalizer } from "@/components/Calendar/lib/localizers"
import { EventPopoverContent } from "@/features/Clients/EventPopoverContent"

const localizer = dayJsLocalizer(dayjs)

interface TestWrapperProps {
	children: React.ReactNode
}

beforeEach(() => {
	cleanup()
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: () => ({
			matches: false,
			media: "",
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}),
	})
})

function TestWrapper({ children }: TestWrapperProps) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	})

	return (
		<QueryClientProvider client={ queryClient }>
			<MantineProvider>
				<ModalsProvider>
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
				</ModalsProvider>
			</MantineProvider>
		</QueryClientProvider>
	)
}

describe("EventPopoverContent", () => {
	it("shows both client and employee when client is primary", () => {
		render(
			<EventPopoverContent
				event={ {
					id: "1",
					title: "Client Name",
					start: new Date("2026-01-01T09:00:00.000Z"),
					end: new Date("2026-01-01T10:00:00.000Z"),
					resources: {
						client: {
							id: "client-id",
							slug: "client-slug",
							name: "Client Name",
							full_name: "Client Full Name",
						},
						employee: {
							slug: "employee-slug",
							name: "Employee Name",
						},
					},
				} }
				localizer={ localizer }
				primaryResource="client"
			/>,
			{ wrapper: TestWrapper }
		)

		expect(screen.getByText("Client Full Name")).toBeInTheDocument()
		expect(screen.getByText("Employee Name")).toBeInTheDocument()
	})
})

