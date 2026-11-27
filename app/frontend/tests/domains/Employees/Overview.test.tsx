import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { EmployeeOverview } from "@/domains/Employees/Overview"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

vi.mock("@inertiajs/react", () => ({
	Link: ({ children, href, ...props }: { children?: React.ReactNode, href: string }) => (
		<a href={ href } { ...props }>{ children }</a>
	),
}))

vi.mock("@/lib/hooks", async (importOriginal) => ({
	...await importOriginal<typeof import("@/lib/hooks")>(),
	useRecordCanUpdate: () => false,
}))

function buildEmployee(overrides: Partial<Schema.EmployeesShow> = {}): Schema.EmployeesShow {
	return {
		id: "employee-1",
		slug: "ada-lovelace",
		name: "Ada Lovelace",
		full_name: "Ada Lovelace",
		first_name: "Ada",
		last_name: "Lovelace",
		person_id: "person-1",
		person: { id: "person-1", name: "Ada Lovelace" } as Schema.PeopleShow,
		status: "employed",
		assigned_clients_count: 2,
		incomplete_trainings_count: 1,
		expiring_credentials_count: 0,
		expiring_clearances_count: 1,
		emergency_contacts_count: 1,
		current_pay_period_id: "period-1",
		current_pay_period_slug: "2024-03-16",
		primary_manager: {
			id: "mgr-1",
			slug: "lead-mgr",
			name: "Lead Manager",
			person: { id: "p-mgr", name: "Lead Manager" },
		} as Schema.EmployeesPersisted,
		interviews: [],
		attended_clients: [],
		clearances: [],
		clients_attendants: [],
		clients_managers: [],
		color_mappings: {},
		created_at: new Date("2024-01-01"),
		credentials: [],
		desired_compensation_currency: "USD",
		desired_compensation_period: "hourly",
		documents: [],
		eligible_for_hire: true,
		employees_trainings: [],
		identifications: [],
		images: [],
		job_title: { id: "jt-1", name: "Caregiver" } as Schema.EmployeeJobTitle,
		managed_clients: [],
		managers_employees_managers: [],
		offers: [],
		pay_rates: [],
		support_contacts: [],
		updated_at: new Date("2024-01-01"),
		...overrides,
	}
}

describe("EmployeeOverview", () => {
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

	it("renders assignment data and quick action links", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<EmployeeOverview employee={ buildEmployee() } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Lead Manager")).toBeInTheDocument()
		expect(screen.getByRole("link", { name: /views.employees.show.tabs.profile/ })).toHaveAttribute(
			"href",
			"/employees/ada-lovelace?tab=profile",
		)
		expect(screen.getByRole("link", { name: /views.employees.show.overview.payroll_review/ })).toHaveAttribute(
			"href",
			"/payroll/periods/2024-03-16/employees/ada-lovelace",
		)
		expect(screen.getByRole("link", { name: /Schedule/ })).toHaveAttribute(
			"href",
			"/employees/ada-lovelace/schedule",
		)
	})

	it("hides payroll review and schedule for non-employed statuses", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<EmployeeOverview
						employee={ buildEmployee({
							status: "applicant",
							current_pay_period_id: "period-1",
							current_pay_period_slug: "2024-03-16",
						}) }
					/>
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.queryByText("views.employees.show.overview.payroll_review")).not.toBeInTheDocument()
		expect(screen.queryByRole("link", { name: /Schedule/ })).not.toBeInTheDocument()
	})

	it("shows a pending termination banner", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<EmployeeOverview
						employee={ buildEmployee({
							pending_termination_at: new Date("2026-04-20T23:59:59Z"),
						}) }
					/>
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Pending termination")).toBeInTheDocument()
		expect(screen.getByText(/Scheduled for/)).toBeInTheDocument()
	})
})
