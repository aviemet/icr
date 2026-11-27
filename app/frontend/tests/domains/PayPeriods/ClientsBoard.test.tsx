import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ClientsBoard } from "@/domains/PayPeriods/ClientsBoard"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const labels: Record<string, string> = {
				"views.pay_periods.clients.title": "Client review",
				"views.pay_periods.clients.help": "Review shifts by client.",
				"views.pay_periods.index.workflow.pending": "Pending",
				"views.pay_periods.index.workflow.closed": "Closed",
				"views.pay_periods.clients.tiles.needs_review": "Needs review",
				"views.pay_periods.clients.tiles.clients": "Clients",
				"views.pay_periods.clients.tiles.totals": "Totals",
				"views.pay_periods.clients.tiles.pending_shifts": "Pending shifts",
				"views.pay_periods.clients.tiles.clients_needing_review": "Clients needing review",
				"views.pay_periods.clients.tiles.reviewed_shifts": "Reviewed shifts",
				"views.pay_periods.clients.tiles.total_shifts": "Total shifts",
				"views.pay_periods.clients.tiles.in_caseload": "In caseload",
				"views.pay_periods.clients.tiles.fully_reviewed": "Fully reviewed",
				"views.pay_periods.clients.tiles.still_pending": "Still pending",
				"views.pay_periods.clients.tiles.ihss_remaining": "Remaining",
				"views.pay_periods.clients.columns.ihss_used": "IHSS used",
				"views.pay_periods.clients.columns.authorized": "Authorized",
				"views.pay_periods.clients.columns.client": "Client",
				"views.pay_periods.clients.columns.pending": "Pending",
				"views.pay_periods.clients.columns.reviewed": "Reviewed",
				"views.pay_periods.clients.columns.status": "Status",
				"views.pay_periods.clients.columns.actions": "Action",
				"views.pay_periods.clients.status_pending": "Needs review",
				"views.pay_periods.clients.status_reviewed": "Reviewed",
				"views.pay_periods.clients.review": "Review",
				"views.pay_periods.clients.reviewed_of_total": "%{reviewed} / %{total}",
				"views.pay_periods.clients.view_employees": "Employee payroll",
				"views.pay_periods.show.back_to_payroll": "Back to Payroll",
			}
			return labels[key] ?? key
		},
	}),
}))

vi.mock("@inertiajs/react", () => ({
	Link: ({ children, href, ...props }: { children?: React.ReactNode, href: string }) => (
		<a href={ href } { ...props }>{ children }</a>
	),
	router: {
		get: vi.fn(),
		visit: vi.fn(),
	},
}))

function client(
	overrides: Partial<Schema.ClientsPersisted> & Pick<Schema.ClientsPersisted, "id" | "name">,
): Schema.ClientsPersisted {
	const name = overrides.name
	return {
		slug: name.toLowerCase().replace(/\s+/g, "-"),
		first_name: name.split(" ")[0] ?? name,
		last_name: name.split(" ").slice(1).join(" ") || name,
		full_name: name,
		person_id: `${overrides.id}-person`,
		person: { id: `${overrides.id}-person`, name } as Schema.PeoplePersisted,
		color_mappings: {},
		created_at: new Date("2024-03-01"),
		updated_at: new Date("2024-03-01"),
		ihss_authorized_hours: 40,
		...overrides,
	}
}

describe("ClientsBoard", () => {
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

	it("renders enriched review, clients, and totals panels", () => {
		const periodClients = [
			client({ id: "1", name: "Roscoe Morgan", ihss_authorized_hours: 80 }),
			client({ id: "2", name: "Mozell Nader", ihss_authorized_hours: 40 }),
		]

		render(
			<MantineProvider theme={ theme }>
				<ClientsBoard
					payPeriodSlug="2024-03-16"
					periodDates={ ["2024-03-16T00:00:00-07:00", "2024-03-31T23:59:59-07:00"] }
					finalized={ false }
					canViewEmployees
					facilitatorPendingShiftCount={ 5 }
					periodClients={ periodClients }
					pendingShiftCountByClient={ { "1": 5, "2": 0 } }
					reviewedShiftCountByClient={ { "1": 0, "2": 4 } }
					totalShiftCountByClient={ { "1": 5, "2": 4 } }
					ihssHoursByClient={ { "1": 6, "2": 0 } }
				/>
			</MantineProvider>,
		)

		expect(screen.getByRole("heading", { name: "Needs review" })).toBeInTheDocument()
		expect(screen.getByText("Pending shifts")).toBeInTheDocument()
		expect(screen.getByText("Clients needing review")).toBeInTheDocument()
		expect(screen.getByText("Reviewed shifts")).toBeInTheDocument()
		expect(screen.getByText("Total shifts")).toBeInTheDocument()

		expect(screen.getByRole("heading", { name: "Clients" })).toBeInTheDocument()
		expect(screen.getByText("In caseload")).toBeInTheDocument()
		expect(screen.getByText("Fully reviewed")).toBeInTheDocument()
		expect(screen.getByText("Still pending")).toBeInTheDocument()

		expect(screen.getByRole("heading", { name: "Totals" })).toBeInTheDocument()
		expect(screen.getByText("IHSS used")).toBeInTheDocument()
		expect(screen.getByText("Authorized")).toBeInTheDocument()
		expect(screen.getByText("Remaining")).toBeInTheDocument()
		expect(screen.getByText("6.00")).toBeInTheDocument()
		expect(screen.getByText("120.00")).toBeInTheDocument()
		expect(screen.getByText("114.00")).toBeInTheDocument()
	})
})
