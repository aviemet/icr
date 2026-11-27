import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ReviewStatusCell } from "@/domains/TimeSheets/ReviewTable/ReviewStatusCell"
import { theme } from "@/lib/theme"

const routerPost = vi.fn()

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const labels: Record<string, string> = {
				"views.pay_periods.client_show.approve": "Approve",
				"views.pay_periods.client_show.unapprove": "Unapprove",
			}
			return labels[key] ?? key
		},
	}),
}))

vi.mock("@inertiajs/react", () => ({
	router: {
		post: (...args: unknown[]) => routerPost(...args),
	},
}))

function reviewShift(overrides: Partial<Schema.ShiftsReview> = {}): Schema.ShiftsReview {
	return {
		id: "occurrence-1",
		calendar_event_id: "event-1",
		client_name: "Maynard Swift",
		client_slug: "maynard-swift",
		created_at: new Date("2024-03-18T12:00:00Z"),
		employee_id: "employee-1",
		employee_name: "Adan King",
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

describe("ReviewStatusCell", () => {
	beforeEach(() => {
		routerPost.mockReset()
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

	it("shows Approve for a pending shift and posts approve", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme }>
				<ReviewStatusCell shift={ reviewShift() } payPeriodId="period-1" />
			</MantineProvider>,
		)

		await user.click(screen.getByRole("button", { name: "Approve" }))

		expect(routerPost).toHaveBeenCalledWith(
			expect.stringContaining("/payroll/shifts/shift-1/approve"),
			expect.objectContaining({ pay_period_id: "period-1" }),
			expect.objectContaining({ preserveState: true, preserveScroll: true }),
		)
	})

	it("shows Unapprove for a reviewed shift and posts unapprove", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme }>
				<ReviewStatusCell
					shift={ reviewShift({ facilitator_approved_at: new Date("2024-03-19T12:00:00Z") }) }
					payPeriodId="period-1"
				/>
			</MantineProvider>,
		)

		await user.click(screen.getByRole("button", { name: "Unapprove" }))

		expect(routerPost).toHaveBeenCalledWith(
			expect.stringContaining("/payroll/shifts/shift-1/unapprove"),
			expect.objectContaining({ pay_period_id: "period-1" }),
			expect.objectContaining({ preserveState: true, preserveScroll: true }),
		)
	})
})
