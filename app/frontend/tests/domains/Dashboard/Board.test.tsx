import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DashboardBoard } from "@/domains/Dashboard"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: Record<string, string | number>) => {
			if(key === "views.dashboard.command_center") return `${options?.company ?? ""} Command Center`
			if(key === "views.dashboard.clients.active_count") return `${options?.count ?? 0} Active Clients`
			if(key === "views.dashboard.team.member_count") return `${options?.count ?? 0} Team Members`
			if(key === "views.dashboard.time.total_hours") return `${options?.hours ?? 0} Hours`
			if(key === "views.dashboard.time.pending_timesheets") return `${options?.count ?? 0} timesheets pending approval`
			if(key === "views.dashboard.activity.item_employee") return `New employee: ${options?.name ?? ""}`
			return key
		},
	}),
}))

vi.mock("@inertiajs/react", () => ({
	Link: ({ children, href, ...props }: { children?: React.ReactNode, href: string }) => (
		<a href={ href } { ...props }>{ children }</a>
	),
	usePage: () => ({
		props: {
			settings: { company_name: "ICR SLS" },
			auth: { user: { person: { name: "Ada Lovelace" } } },
		},
	}),
}))

vi.mock("@/lib/hooks", () => ({
	usePageProps: () => ({
		settings: { company_name: "ICR SLS" },
		auth: { user: { person: { name: "Ada Lovelace" } } },
	}),
}))

function buildDashboard(overrides: Partial<Schema.DashboardStats> = {}): Schema.DashboardStats {
	return {
		active_client_count: 4,
		inactive_client_count: 0,
		active_team_count: 2,
		hiring_pipeline_count: 3,
		pending_timesheet_count: 1,
		week_tracked_hours: 40.5,
		upcoming_events: [
			{ id: "event-1", name: "Morning shift", starts_at: "2026-11-19T09:00:00Z" } as Schema.DashboardStatsUpcomingEvent,
		],
		activity_items: [
			{ id: "emp-1", kind: "employee", name: "Lawrence Schultz" } as Schema.DashboardStatsActivityItem,
		],
		...overrides,
	}
}

describe("DashboardBoard", () => {
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

	it("renders welcome chrome, metric tiles, and action links", () => {
		render(
			<MantineProvider theme={ theme }>
				<DashboardBoard dashboard={ buildDashboard() } />
			</MantineProvider>,
		)

		expect(screen.getByText("Ada Lovelace")).toBeInTheDocument()
		expect(screen.getByText("ICR SLS Command Center")).toBeInTheDocument()
		expect(screen.getByText("views.dashboard.clients.title")).toBeInTheDocument()
		expect(screen.getByText("views.dashboard.team.title")).toBeInTheDocument()
		expect(screen.getByText("views.dashboard.time.title")).toBeInTheDocument()
		expect(screen.getByText("Morning shift")).toBeInTheDocument()
		expect(screen.getByText("New employee: Lawrence Schultz")).toBeInTheDocument()
		expect(screen.getByText("views.dashboard.clients.view_all")).toBeInTheDocument()
		expect(screen.getByText("views.dashboard.time.view")).toBeInTheDocument()
	})
})
