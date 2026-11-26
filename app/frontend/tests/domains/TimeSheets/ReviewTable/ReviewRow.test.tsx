import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Table } from "@/components"
import { ReviewRow } from "@/domains/TimeSheets/ReviewTable/ReviewRow"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const labels: Record<string, string> = {
				"views.timesheets.employee_review.ihss": "IHSS",
				"views.timesheets.employee_review.mark_ihss": "Mark IHSS",
				"views.timesheets.employee_review.clear_ihss": "Clear IHSS",
				"views.timesheets.employee_review.client_calendar": "Client calendar",
				"views.timesheets.employee_review.employee_calendar": "Employee calendar",
				"views.timesheets.index.no_value": "--",
			}
			return labels[key] ?? key
		},
	}),
}))

vi.mock("@inertiajs/react", () => ({
	router: {
		get: vi.fn(),
		patch: vi.fn(),
		post: vi.fn(),
		visit: vi.fn(),
	},
}))

vi.mock("@/queries/calendarEvents/mutations", () => ({
	useUpdateCalendarEvent: () => ({
		mutateAsync: vi.fn(),
	}),
}))

function reviewShift(overrides: Partial<Schema.ShiftsReview> = {}): Schema.ShiftsReview {
	return {
		id: "occurrence-1",
		calendar_event_id: "event-1",
		client_name: "Roscoe Morgan",
		client_slug: "roscoe-morgan",
		created_at: new Date("2024-03-18T12:00:00Z"),
		employee_id: "employee-1",
		employee_name: "Carlton Ortiz",
		ends_at: new Date("2024-03-18T18:00:00Z"),
		ihss: false,
		is_recurring: false,
		service_type: {
			id: "st-1",
			active: true,
			allows_multi_client: false,
			billable: true,
			color: "#15803D",
			name: "Regular",
			payable: true,
			position: 0,
			requires_notes: false,
			slug: "regular",
			system: false,
			tracks_mileage: false,
		},
		service_type_id: "st-1",
		shift_id: "shift-1",
		starts_at: new Date("2024-03-18T12:00:00Z"),
		updated_at: new Date("2024-03-18T12:00:00Z"),
		...overrides,
	}
}

function renderRow(shift: Schema.ShiftsReview) {
	return render(
		<MantineProvider theme={ theme }>
			<Table>
				<Table.Body>
					<ReviewRow
						shift={ shift }
						shiftExceptionReasons={ {} }
						shiftOtHours={ {} }
						canEditTimes={ false }
						onDelete={ () => {} }
						deleting={ false }
						employeeSlug="carlton-ortiz"
						payPeriodId="period-1"
						clientId="client-1"
						reloadHref="/reload"
						showClientColumn={ false }
						canFacilitatorApprove={ false }
						canEditIhss
						canEditShiftType={ false }
					/>
				</Table.Body>
			</Table>
		</MantineProvider>,
	)
}

describe("ReviewRow IHSS column", () => {
	beforeEach(() => {
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

	it("shows a checkmark when the shift is IHSS", () => {
		renderRow(reviewShift({ ihss: true }))

		expect(screen.getByLabelText("IHSS")).toBeInTheDocument()
	})

	it("leaves the IHSS cell empty when the shift is not IHSS", () => {
		renderRow(reviewShift({ ihss: false }))

		expect(screen.queryByLabelText("IHSS")).not.toBeInTheDocument()
	})
})
