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

const eventFormCopy: Record<string, string> = {
	"views.clients.schedule.event_form.shift_type": "Shift Type",
	"views.clients.schedule.event_form.repeats": "Repeats",
	"views.clients.schedule.event_form.frequency": "Frequency",
	"views.clients.schedule.event_form.frequency_daily": "Daily",
	"views.clients.schedule.event_form.frequency_weekly": "Weekly",
	"views.clients.schedule.event_form.frequency_monthly": "Monthly",
	"views.clients.schedule.event_form.frequency_yearly": "Yearly",
	"views.clients.schedule.event_form.interval": "Every %{unit}",
	"views.clients.schedule.event_form.interval_daily": "day(s)",
	"views.clients.schedule.event_form.interval_weekly": "week(s)",
	"views.clients.schedule.event_form.interval_monthly": "month(s)",
	"views.clients.schedule.event_form.interval_yearly": "year(s)",
	"views.clients.schedule.event_form.weekdays": "Repeat on",
	"views.clients.schedule.event_form.monthly_mode": "Monthly on",
	"views.clients.schedule.event_form.monthly_on_day": "Day of the month",
	"views.clients.schedule.event_form.monthly_on_weekday": "Weekday of the month",
	"views.clients.schedule.event_form.ends": "Ends",
	"views.clients.schedule.event_form.ends_never": "Never",
	"views.clients.schedule.event_form.ends_on_date": "On date",
	"views.clients.schedule.event_form.ends_after": "After",
	"views.clients.schedule.event_form.until": "End date",
	"views.clients.schedule.event_form.occurrences": "Occurrences",
	"views.clients.schedule.event_form.occurrences_hint": "Including the first event",
	"views.clients.schedule.event_form.weekday_sun": "Sun",
	"views.clients.schedule.event_form.weekday_mon": "Mon",
	"views.clients.schedule.event_form.weekday_tue": "Tue",
	"views.clients.schedule.event_form.weekday_wed": "Wed",
	"views.clients.schedule.event_form.weekday_thu": "Thu",
	"views.clients.schedule.event_form.weekday_fri": "Fri",
	"views.clients.schedule.event_form.weekday_sat": "Sat",
	"views.clients.schedule.event_form.edit_recurring_body": "Apply these changes to which events?",
	"views.clients.schedule.event_form.edit_all_events": "All events",
	"views.clients.schedule.event_form.edit_this_and_future": "This and all future events",
	"views.clients.schedule.event_form.edit_this_occurrence": "Just this event",
	"views.clients.schedule.event_form.edit_scope_cancel": "Back",
}

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: Record<string, string>) => {
			const template = eventFormCopy[key] ?? key
			if(!options) return template
			return template.replace(/%\{(\w+)\}/g, (_, name: string) => options[name] ?? "")
		},
	}),
}))

vi.mock("@/components/Inputs", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/components/Inputs")>()

	function MockDateInput({
		label,
		value,
		onChange,
	}: {
		label?: React.ReactNode
		value?: string | Date | null
		onChange?: (value: string | null) => void
	}) {
		const labelText = typeof label === "string" ? label : "Until"
		const stringValue = typeof value === "string" ? value : ""
		return (
			<label>
				{ labelText }
				<input
					aria-label={ labelText }
					value={ stringValue }
					onChange={ (event) => {
						onChange?.(event.target.value === "" ? null : event.target.value)
					} }
				/>
			</label>
		)
	}

	return {
		...actual,
		DateInput: MockDateInput,
	}
})

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
		http.get(Routes.apiServiceTypesOptions(), () => {
			return HttpResponse.json([
				{
					id: "st-1",
					name: "Regular",
					slug: "regular",
					active: true,
					color: "#15803D",
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
			recurring_patterns_attributes?: Array<{
				recurring_type: string
				offset: number
				day_of_week: number
				end_date: string
			}>
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

		expect(screen.getByRole("switch", { name: /^Repeats$/i })).toBeInTheDocument()

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
		expect(calendarEvent.recurring_patterns_attributes).toBeUndefined()
	})

	it("includes recurring_patterns_attributes when repeat is enabled", async () => {
		const user = userEvent.setup()
		type PostedCalendarEvent = {
			recurring_patterns_attributes?: Array<{
				recurring_type: string
				offset: number
				day_of_week: number
				end_date?: string
				max_occurrences?: number
			}>
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
			expect(screen.getByRole("switch", { name: /^Repeats$/i })).toBeInTheDocument()
		})

		await user.click(screen.getByRole("switch", { name: /^Repeats$/i }))

		await waitFor(() => {
			expect(screen.getByRole("combobox", { name: "Frequency" })).toBeInTheDocument()
			expect(screen.getByRole("combobox", { name: "Ends" })).toBeInTheDocument()
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

		expect(postedBody.calendar_event.recurring_patterns_attributes).toEqual([
			{
				recurring_type: "weekly",
				offset: 1,
				day_of_week: start.getDay(),
			},
		])
	})
})

describe("EventForm edit recurrence", () => {
	it("shows hydrated repeat controls when editing a recurring occurrence", async () => {
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
						<EventForm
							client={ client }
							event={ {
								id: "master-1__occ",
								title: "Shift",
								start,
								end,
								resources: {
									employee: { id: employeeId, name: employeeName },
									client,
									recurrence: {
										masterId: "master-1",
										occurrenceStartsAt: "2026-11-23T09:00:00.000Z",
										isRecurring: true,
										patterns: [
											{
												recurring_type: "weekly",
												offset: 1,
												day_of_week: start.getDay(),
												end_date: "2026-12-31",
											},
										],
									},
								},
							} }
						/>
					</DatesProvider>
				</MantineProvider>
			</QueryClientProvider>,
		)

		await waitFor(() => {
			expect(screen.getByRole("switch", { name: /^Repeats$/i })).toBeChecked()
			expect(screen.getByRole("combobox", { name: "Frequency" })).toBeInTheDocument()
			expect(screen.getByRole("combobox", { name: "Ends" })).toBeInTheDocument()
		})
	})

	it("prompts for edit scope after save on a recurring occurrence", async () => {
		const user = userEvent.setup()
		type PostedCalendarEvent = {
			edit_scope?: string
			occurrence_starts_at?: string
		}
		type PostedBody = { calendar_event: PostedCalendarEvent }
		const captured: { body: PostedBody | null } = { body: null }
		const occurrenceStartsAt = "2026-11-23T09:00:00.000Z"

		server.use(
			http.patch(Routes.apiCalendarEvent("master-1"), async ({ request }) => {
				captured.body = await request.json() as PostedBody
				return HttpResponse.json({ id: "master-1" }, { status: 201 })
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
						<EventForm
							client={ client }
							event={ {
								id: "master-1__occ",
								title: "Shift",
								start,
								end,
								resources: {
									employee: { id: employeeId, name: employeeName },
									client,
									recurrence: {
										masterId: "master-1",
										occurrenceStartsAt,
										isRecurring: true,
										patterns: [
											{
												recurring_type: "weekly",
												offset: 1,
												day_of_week: start.getDay(),
											},
										],
									},
								},
							} }
						/>
					</DatesProvider>
				</MantineProvider>
			</QueryClientProvider>,
		)

		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Save Shift" })).toBeInTheDocument()
		})

		await user.click(screen.getByRole("button", { name: "Save Shift" }))

		await waitFor(() => {
			expect(screen.getByRole("button", { name: "All events" })).toBeInTheDocument()
			expect(screen.getByRole("button", { name: "This and all future events" })).toBeInTheDocument()
			expect(screen.getByRole("button", { name: "Just this event" })).toBeInTheDocument()
		})

		await user.click(screen.getByRole("button", { name: "Just this event" }))

		await waitFor(() => {
			if(captured.body === null) {
				throw new Error("Expected update request body")
			}
		})

		expect(captured.body?.calendar_event.edit_scope).toBe("one")
		expect(captured.body?.calendar_event.occurrence_starts_at).toBe(occurrenceStartsAt)
	})

	it("sends occurrence_starts_at when saving all events on a recurring occurrence", async () => {
		const user = userEvent.setup()
		type PostedCalendarEvent = {
			edit_scope?: string
			occurrence_starts_at?: string
		}
		type PostedBody = { calendar_event: PostedCalendarEvent }
		const captured: { body: PostedBody | null } = { body: null }
		const occurrenceStartsAt = "2026-11-23T09:00:00.000Z"

		server.use(
			http.patch(Routes.apiCalendarEvent("master-1"), async ({ request }) => {
				captured.body = await request.json() as PostedBody
				return HttpResponse.json({ id: "master-1" }, { status: 201 })
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
						<EventForm
							client={ client }
							event={ {
								id: "master-1__occ",
								title: "Shift",
								start,
								end,
								resources: {
									employee: { id: employeeId, name: employeeName },
									client,
									recurrence: {
										masterId: "master-1",
										occurrenceStartsAt,
										isRecurring: true,
										patterns: [
											{
												recurring_type: "weekly",
												offset: 1,
												day_of_week: start.getDay(),
											},
										],
									},
								},
							} }
						/>
					</DatesProvider>
				</MantineProvider>
			</QueryClientProvider>,
		)

		await user.click(await screen.findByRole("button", { name: "Save Shift" }))
		await user.click(await screen.findByRole("button", { name: "All events" }))

		await waitFor(() => {
			if(captured.body === null) {
				throw new Error("Expected update request body")
			}
		})

		expect(captured.body?.calendar_event.edit_scope).toBe("all")
		expect(captured.body?.calendar_event.occurrence_starts_at).toBe(occurrenceStartsAt)
	})
})

