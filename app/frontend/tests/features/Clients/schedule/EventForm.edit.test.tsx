import { MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import dayjs from "dayjs"
import { http, HttpResponse } from "msw"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { EventForm } from "@/domains/Clients/schedule/EventForm"
import { Routes } from "@/lib"
import { theme } from "@/lib/theme"
import { server } from "@/tests/helpers/mockServer"

const employeeId = "emp-1"
const employeeName = "Kristopher Fisher"
const start = dayjs("2026-11-16T00:00:00.000").toDate()
const end = dayjs("2026-11-16T06:00:00.000").toDate()

const client = {
	id: "client-1",
	slug: "demetrius-barton",
	name: "Demetrius Barton",
	full_name: "Demetrius Barton",
} as Schema.ClientsPersisted

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
	class ResizeObserverMock {
		observe() {}
		unobserve() {}
		disconnect() {}
	}
	window.ResizeObserver = ResizeObserverMock

	server.use(
		http.get(Routes.apiEmployeesOptions(), () => {
			return HttpResponse.json([
				{
					id: employeeId,
					name: employeeName,
					full_name: employeeName,
					first_name: "Kristopher",
					last_name: "Fisher",
					slug: "kristopher-fisher",
					person: { name: employeeName },
					color_mappings: {},
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
			])
		}),
		http.get(Routes.apiCategoryOptions("Calendar::Event"), () => {
			return HttpResponse.json([
				{
					id: "cat-1",
					name: "Shift",
					slug: "calendar-event-shift",
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
			])
		}),
		http.patch(Routes.apiCalendarEvent("event-1"), async ({ request }) => {
			const body = await request.json().catch(() => ({}))
			return HttpResponse.json({ id: "event-1", ...(typeof body === "object" && body ? body : {}) }, { status: 200 })
		}),
		http.post(Routes.apiCalendarEvents(), async ({ request }) => {
			const body = await request.json().catch(() => ({}))
			return HttpResponse.json({ id: "event-new", ...(typeof body === "object" && body ? body : {}) }, { status: 201 })
		}),
	)
})


function renderEditForm(onSuccess?: () => void) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	})

	return render(
		<QueryClientProvider client={ queryClient }>
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<DatesProvider settings={ { consistentWeeks: true } }>
					<EventForm
						client={ client }
						event={ {
							id: "event-1",
							title: employeeName,
							start,
							end,
							allDay: false,
							resources: {
								employee: {
									id: employeeId,
									name: employeeName,
									slug: "kristopher-fisher",
								},
								client,
							},
						} }
						onSuccess={ onSuccess }
					/>
				</DatesProvider>
			</MantineProvider>
		</QueryClientProvider>,
	)
}

describe("EventForm edit population", () => {
	it("populates employee name and start/end dates from the existing event", async () => {
		renderEditForm()

		await waitFor(() => {
			const employeeCombobox = screen.getByRole("combobox", { name: "Employee" })
			expect(employeeCombobox).toHaveValue(employeeName)
		})

		await waitFor(() => {
			const startsAt = document.querySelector('input[name="calendar_event.starts_at"]')
			const endsAt = document.querySelector('input[name="calendar_event.ends_at"]')
			if(!(startsAt instanceof HTMLInputElement)) throw new Error("Expected starts_at hidden input")
			if(!(endsAt instanceof HTMLInputElement)) throw new Error("Expected ends_at hidden input")
			expect(startsAt.value).not.toBe("")
			expect(endsAt.value).not.toBe("")
			expect(dayjs(startsAt.value).isSame(start)).toBe(true)
			expect(dayjs(endsAt.value).isSame(end)).toBe(true)
		})

		await waitFor(() => {
			expect(screen.getByLabelText("Start date")).toHaveTextContent(dayjs(start).format("L"))
			expect(screen.getByLabelText("End date")).toHaveTextContent(dayjs(end).format("L"))
		})
	})

	it("calls onSuccess after a successful save", async () => {
		const onSuccess = vi.fn()
		const user = userEvent.setup()
		renderEditForm(onSuccess)

		await waitFor(() => {
			expect(screen.getByRole("combobox", { name: "Employee" })).toHaveValue(employeeName)
		})

		await user.click(screen.getByRole("button", { name: "Save Shift" }))

		await waitFor(() => {
			expect(onSuccess).toHaveBeenCalledTimes(1)
		})
	})
})

describe("EventForm create participants", () => {
	it("includes the client as an event participant on create", async () => {
		const user = userEvent.setup()
		type PostedCalendarEvent = {
			event_participants_attributes?: Array<{ participant_id: string, participant_type: string }>
			event_participants?: Array<{ participant_id: string, participant_type: string }>
			shift_attributes?: { employee_id?: string }
		}
		type PostedBody = { calendar_event: PostedCalendarEvent }
		const captured: { body: PostedBody | null } = { body: null }

		server.use(
			http.post(Routes.apiCalendarEvents(), async ({ request }) => {
				captured.body = await request.json() as PostedBody
				return HttpResponse.json({ id: "event-new" }, { status: 201 })
			}),
		)

		const queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		})

		render(
			<QueryClientProvider client={ queryClient }>
				<MantineProvider theme={ theme } defaultColorScheme="dark">
					<DatesProvider settings={ { consistentWeeks: true } }>
						<EventForm client={ client } selectedDate={ start } />
					</DatesProvider>
				</MantineProvider>
			</QueryClientProvider>,
		)

		await waitFor(() => {
			expect(screen.getByRole("combobox", { name: "Employee" })).toBeInTheDocument()
		})

		await user.click(screen.getByRole("button", { name: "Save Shift" }))

		await waitFor(() => {
			if(captured.body === null) {
				throw new Error("Expected create request body")
			}
		})

		const postedBody = captured.body
		if(postedBody === null) {
			throw new Error("Expected create request body")
		}

		const calendarEvent = postedBody.calendar_event
		expect(calendarEvent.event_participants_attributes).toEqual([
			{ participant_type: "Client", participant_id: client.id },
		])
		expect(calendarEvent.event_participants).toBeUndefined()
		expect(calendarEvent.shift_attributes).toBeDefined()
	})
})

