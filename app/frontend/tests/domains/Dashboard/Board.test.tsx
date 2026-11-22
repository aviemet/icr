import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DashboardBoard } from "@/domains/Dashboard"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: Record<string, string | number>) => {
			if(key === "views.dashboard.command_center") return `${options?.company ?? ""} Command Center`
			if(key === "views.dashboard.clients.active_count") return "Active clients"
			if(key === "views.dashboard.clients.inactive_count") return "Inactive"
			if(key === "views.dashboard.team.member_count") return "Team members"
			if(key === "views.dashboard.team.hiring_pipeline") return "In hiring pipeline"
			if(key === "views.dashboard.time.total_hours") return `${options?.hours ?? 0} Hours`
			if(key === "views.dashboard.time.total_hours_week") return "Total hours tracked this week"
			if(key === "views.dashboard.time.pending_timesheets") return "Timesheets pending approval"
			if(key === "views.dashboard.schedule.open_shifts") return "Open shifts to fill"
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
	usePermissions: () => ({
		can: () => true,
	}),
}))

function buildDashboard(overrides: Partial<Schema.DashboardStats> = {}): Schema.DashboardStats {
	return {
		active_client_count: 4,
		inactive_client_count: 0,
		active_team_count: 2,
		hiring_pipeline_count: 3,
		pending_timesheet_count: 1,
		open_shift_count: 0,
		week_tracked_hours: 40.5,
		pending_terminations: [],
		upcoming_events: [
			{ id: "event-1", name: "Morning shift", starts_at: "2026-11-19T09:00:00Z" } as Schema.DashboardStatsUpcomingEvent,
		],
		open_shifts: [],
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
				<ModalsProvider>
					<DashboardBoard dashboard={ buildDashboard() } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Ada Lovelace")).toBeInTheDocument()
		expect(screen.getByText("ICR SLS Command Center")).toBeInTheDocument()
		expect(screen.getByText("views.dashboard.clients.title")).toBeInTheDocument()
		expect(screen.getByText("views.dashboard.team.title")).toBeInTheDocument()
		expect(screen.getByText("views.dashboard.time.title")).toBeInTheDocument()
		expect(screen.getByRole("link", { name: /4 Active clients/i })).toHaveAttribute("href", "/clients")
		expect(screen.queryByText("4 Active Clients")).not.toBeInTheDocument()
		expect(screen.getByRole("link", { name: /2 Team members/i })).toHaveAttribute("href", "/employees")
		expect(screen.getByRole("link", { name: /Inactive/i })).toHaveAttribute("href", "/clients")
		expect(screen.getByRole("link", { name: /In hiring pipeline/i })).toHaveAttribute("href", "/employees/applicants")
		expect(screen.getByRole("link", { name: /Timesheets pending approval/i })).toHaveAttribute("href", "/payroll")
		expect(screen.getByRole("link", { name: /40\.5 Total hours tracked this week/i })).toHaveAttribute("href", "/payroll")
		expect(screen.getByText("Morning shift")).toBeInTheDocument()
		expect(screen.getByText("New employee: Lawrence Schultz")).toBeInTheDocument()
		expect(screen.getByText("views.dashboard.clients.view_all")).toBeInTheDocument()
		expect(screen.getByText("views.dashboard.time.view")).toBeInTheDocument()
	})

	it("renders open shifts with alert count and schedule links", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<DashboardBoard
						dashboard={ buildDashboard({
							open_shift_count: 2,
							open_shifts: [
								{
									id: "shift-1",
									client_name: "Maria Santos",
									client_slug: "maria-santos",
									starts_at: "2026-11-21T09:00:00Z",
									ends_at: "2026-11-21T17:00:00Z",
								},
							],
						}) }
					/>
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByRole("link", { name: /Open shifts to fill/i })).toHaveAttribute(
			"href",
			"/clients/maria-santos/schedule",
		)
		expect(screen.getByText("Maria Santos")).toBeInTheDocument()
	})

	it("renders pending terminations with cancel", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<DashboardBoard
						dashboard={ buildDashboard({
							pending_terminations: [
								{
									id: "emp-2",
									slug: "waldo-heathcote",
									name: "Waldo Heathcote",
									inactive_at: new Date("2026-04-20T23:59:59Z"),
								},
							],
						}) }
					/>
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Pending terminations")).toBeInTheDocument()
		expect(screen.getByText("Waldo Heathcote")).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
	})
})
