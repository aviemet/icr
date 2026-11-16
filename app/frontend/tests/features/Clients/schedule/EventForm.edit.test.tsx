import { MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import dayjs from "dayjs"
import { http, HttpResponse } from "msw"
import { beforeEach, describe, expect, it } from "vitest"

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
	)
})

function renderEditForm() {
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
})
