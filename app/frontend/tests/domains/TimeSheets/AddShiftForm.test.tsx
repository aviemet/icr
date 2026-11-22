import { MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { AddShiftForm } from "@/domains/TimeSheets/AddShiftForm"
import { theme } from "@/lib/theme"

const mutateAsync = vi.fn()
const routerGet = vi.fn()
const closeModal = vi.fn()

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const labels: Record<string, string> = {
				"views.timesheets.employee_review.client": "Client",
				"views.timesheets.employee_review.start_date": "Start date",
				"views.timesheets.employee_review.start_time": "Start time",
				"views.timesheets.employee_review.end_date": "End date",
				"views.timesheets.employee_review.end_time": "End time",
				"views.timesheets.employee_review.add_shift_submit": "Add shift",
				"views.timesheets.employee_review.add_shift": "Add shift",
			}
			return labels[key] ?? key
		},
	}),
}))

vi.mock("@inertiajs/react", () => ({
	router: {
		get: (...args: unknown[]) => routerGet(...args),
	},
}))

vi.mock("@/components/Modal", () => ({
	useModalContext: () => ({
		opened: true,
		open: vi.fn(),
		close: closeModal,
		toggle: vi.fn(),
	}),
}))

vi.mock("@/queries/calendarEvents/mutations", () => ({
	useCreateCalendarEvent: () => ({
		mutateAsync,
	}),
}))

vi.mock("@/queries", () => ({
	useGetClientsAsOptions: () => ({
		data: [
			{ id: "client-1", name: "Client One", slug: "client-one" },
		],
		isStale: false,
		refetch: vi.fn(),
	}),
}))

vi.mock("@/lib", async () => {
	const actual = await vi.importActual<typeof import("@/lib")>("@/lib")
	return {
		...actual,
		categorySlug: () => "calendar-event-shift",
		Routes: {
			...actual.Routes,
			periodEmployeeReview: (payPeriodId: string, employeeId: string) => (
				`/payroll/periods/${payPeriodId}/employees/${employeeId}`
			),
			apiCalendarEvents: () => "/api/calendar_events",
		},
	}
})

describe("AddShiftForm", () => {
	beforeEach(() => {
		mutateAsync.mockReset()
		routerGet.mockReset()
		closeModal.mockReset()
		mutateAsync.mockResolvedValue({ id: "event-1" })
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

	afterEach(() => {
		cleanup()
	})

	it("posts a calendar event for the employee and reloads review", async () => {
		const user = userEvent.setup()
		const queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		})

		render(
			<QueryClientProvider client={ queryClient }>
				<MantineProvider theme={ theme }>
					<AddShiftForm
						employeeId="employee-1"
						payPeriodId="period-1"
						periodDates={ [
							new Date("2024-03-16T00:00:00"),
							new Date("2024-03-31T23:59:59"),
						] }
					/>
				</MantineProvider>
			</QueryClientProvider>,
		)

		await user.click(screen.getByRole("combobox", { name: "Client" }))
		await user.click(await screen.findByText("Client One"))
		await user.click(screen.getByRole("button", { name: "Add shift" }))

		await waitFor(() => {
			expect(mutateAsync).toHaveBeenCalled()
		})

		const payload = mutateAsync.mock.calls[0][0]
		expect(payload.calendar_event.shift_attributes).toEqual({
			employee_id: "employee-1",
			category_id: "calendar-event-shift",
		})
		expect(payload.calendar_event.event_participants_attributes).toEqual([
			{ participant_type: "Client", participant_id: "client-1" },
		])
		expect(payload.calendar_event.category_slug).toBe("calendar-event-shift")
		expect(closeModal).toHaveBeenCalled()
		expect(routerGet).toHaveBeenCalledWith("/payroll/periods/period-1/employees/employee-1")
	})
})
