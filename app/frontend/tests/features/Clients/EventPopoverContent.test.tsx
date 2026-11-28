import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import dayjs from "dayjs"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CalendarProvider } from "@/components/Calendar"
import { dayJsLocalizer } from "@/components/Calendar/lib/localizers"
import { EventPopoverContent } from "@/domains/Clients/EventPopoverContent"

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
							closePopover: () => {},
							localizer,
							handleViewChange: () => {},
							handleDateChange: () => {},
							onClick: () => {},
							resourcesById: new Map(),
							groupByResource: false,
							maxEvents: Infinity,
							prevDate: new Date(),
							currentView: "month",
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

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

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

	it("opens the edit form immediately for recurring events", async () => {
		const user = userEvent.setup()

		render(
			<EventPopoverContent
				event={ {
					id: "master-1__occ",
					title: "Client Name",
					start: new Date("2026-01-08T09:00:00.000Z"),
					end: new Date("2026-01-08T10:00:00.000Z"),
					resources: {
						client: {
							id: "client-id",
							slug: "client-slug",
							name: "Client Name",
							full_name: "Client Full Name",
						},
						employee: {
							id: "employee-id",
							slug: "employee-slug",
							name: "Employee Name",
						},
						recurrence: {
							masterId: "master-1",
							occurrenceStartsAt: "2026-01-08T09:00:00.000Z",
							isRecurring: true,
							patterns: [
								{ recurring_type: "weekly", offset: 1, day_of_week: 4 },
							],
						},
					},
				} }
				localizer={ localizer }
				primaryResource="client"
			/>,
			{ wrapper: TestWrapper }
		)

		await user.click(screen.getByRole("button", { name: /edit/i }))

		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Save Shift" })).toBeInTheDocument()
		})
		expect(screen.queryByText("views.clients.schedule.event_form.edit_recurring_body")).not.toBeInTheDocument()
	})
})
