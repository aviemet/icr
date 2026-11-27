import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axios from "axios"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Table } from "@/components"
import { ReviewRow } from "@/domains/TimeSheets/ReviewTable/ReviewRow"
import { theme } from "@/lib/theme"

vi.mock("axios", () => ({
	default: {
		patch: vi.fn(),
	},
}))

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
			assignable: true,
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

function renderRow(
	shift: Schema.ShiftsReview,
	onIhssToggle: (delta: { ihss: boolean }) => void = () => {},
) {
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
						showIhss
						canEditIhss
						canEditShiftType={ false }
						onIhssToggle={ onIhssToggle }
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
		vi.mocked(axios.patch).mockReset()
	})

	afterEach(() => {
		cleanup()
	})

	it("renders a checked checkbox for IHSS shifts", () => {
		renderRow(reviewShift({ ihss: true }))

		expect(screen.getByRole("checkbox", { name: "IHSS" })).toBeChecked()
		expect(screen.queryByRole("button", { name: "Clear IHSS" })).not.toBeInTheDocument()
	})

	it("renders an unchecked checkbox for non-IHSS shifts", () => {
		renderRow(reviewShift({ ihss: false }))

		expect(screen.getByRole("checkbox", { name: "IHSS" })).not.toBeChecked()
		expect(screen.queryByRole("button", { name: "Mark IHSS" })).not.toBeInTheDocument()
	})

	it("toggles IHSS from the column checkbox", async () => {
		const user = userEvent.setup()
		const onIhssToggle = vi.fn()
		vi.mocked(axios.patch).mockResolvedValue({
			data: { ihss: true, shift_id: "shift-1" },
		})

		renderRow(reviewShift({ ihss: false }), onIhssToggle)

		await user.click(screen.getByRole("checkbox", { name: "IHSS" }))

		await waitFor(() => {
			expect(axios.patch).toHaveBeenCalledWith(
				expect.stringContaining("/payroll/shifts/shift-1/ihss"),
				expect.objectContaining({
					ihss: true,
					pay_period_id: "period-1",
					client_id: "client-1",
				}),
			)
		})
		expect(onIhssToggle).toHaveBeenCalledWith({ ihss: true, shift_id: "shift-1" })
	})
})
