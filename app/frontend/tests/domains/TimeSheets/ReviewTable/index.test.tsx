import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ReviewTable } from "@/domains/TimeSheets/ReviewTable"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const labels: Record<string, string> = {
				"views.timesheets.employee_review.date": "Date",
				"views.timesheets.employee_review.client": "Client",
				"views.timesheets.employee_review.in_out_times": "In / Out Times",
				"views.timesheets.employee_review.hours": "Hours",
				"views.timesheets.employee_review.shift_type": "Shift Type",
				"views.timesheets.employee_review.ihss": "IHSS",
				"views.timesheets.employee_review.ot": "OT",
				"views.timesheets.employee_review.exception": "Exception",
				"views.timesheets.employee_review.actions": "Actions",
				"views.timesheets.employee_review.client_calendar": "Client calendar",
				"views.timesheets.employee_review.employee_calendar": "Employee calendar",
				"views.pay_periods.client_show.columns.status": "Status",
				"views.pay_periods.clients.status_reviewed": "Reviewed",
				"views.pay_periods.clients.status_pending": "Needs review",
				"views.pay_periods.client_show.approve": "Approve",
				"views.pay_periods.client_show.unapprove": "Unapprove",
				"views.timesheets.index.no_value": "--",
				"views.timesheets.employee_review.no_shifts": "No shifts in this period",
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

vi.mock("@mantine/modals", () => ({
	useModals: () => ({
		openConfirmModal: vi.fn(),
	}),
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

function renderTable(overrides: {
	showIhss?: boolean
	canFacilitatorApprove?: boolean
} = {}) {
	return render(
		<MantineProvider theme={ theme }>
			<ReviewTable
				shifts={ [reviewShift()] }
				canEditTimes={ false }
				employeeId="employee-1"
				employeeSlug="carlton-ortiz"
				payPeriodId="period-1"
				payPeriodSlug="2024-03-16"
				showIhss={ overrides.showIhss }
				canFacilitatorApprove={ overrides.canFacilitatorApprove }
			/>
		</MantineProvider>,
	)
}

describe("ReviewTable", () => {
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

	it("shows the IHSS column when IHSS is enabled", () => {
		renderTable({ showIhss: true })

		expect(screen.getByRole("columnheader", { name: "IHSS" })).toBeInTheDocument()
	})

	it("hides the IHSS column when IHSS is not shown", () => {
		renderTable({ showIhss: false })

		expect(screen.queryByRole("columnheader", { name: "IHSS" })).not.toBeInTheDocument()
	})

	it("uses the status column Approve button without a duplicate actions control", () => {
		renderTable({ canFacilitatorApprove: true })

		expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument()
		expect(screen.getAllByRole("button", { name: "Approve" })).toHaveLength(1)
	})
})
