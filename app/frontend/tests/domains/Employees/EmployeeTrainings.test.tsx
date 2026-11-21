import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { EmployeeTrainings } from "@/domains/Employees/Trainings"
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
	router: {
		visit: vi.fn(),
		delete: vi.fn(),
	},
}))

vi.mock("@/lib/hooks", async (importOriginal) => ({
	...await importOriginal<typeof import("@/lib/hooks")>(),
	useRecordCanUpdate: () => true,
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
		assigned_clients_count: 0,
		incomplete_trainings_count: 1,
		expiring_credentials_count: 0,
		expiring_clearances_count: 0,
		emergency_contacts_count: 0,
		current_pay_period_id: undefined,
		primary_manager: null as unknown as Schema.EmployeesPersisted,
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
		employees_trainings: [
			{
				id: "et-1",
				employee_id: "employee-1",
				training_id: "tr-1",
				started_at: new Date("2024-02-01"),
				completed_at: null as unknown as Date,
				status: "in_progress",
				training: {
					id: "tr-1",
					name: "Orientation",
					status: "active",
					created_at: new Date("2024-01-01"),
					updated_at: new Date("2024-01-01"),
				},
				created_at: new Date("2024-02-01"),
				updated_at: new Date("2024-02-01"),
			},
		],
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

describe("EmployeeTrainings", () => {
	beforeEach(() => {
		cleanup()
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: () => ({
				matches: false,
				addListener: () => undefined,
				removeListener: () => undefined,
				addEventListener: () => undefined,
				removeEventListener: () => undefined,
				dispatchEvent: () => false,
			}),
		})
	})

	it("shows mark complete when canCompleteTrainings is true", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<EmployeeTrainings
						employee={ buildEmployee() }
						trainingOptions={ [] }
						canCompleteTrainings={ true }
					/>
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Orientation")).toBeTruthy()
		expect(screen.getByText("views.employees.show.trainings.mark_complete")).toBeTruthy()
	})

	it("hides mark complete when canCompleteTrainings is false", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<EmployeeTrainings
						employee={ buildEmployee() }
						trainingOptions={ [] }
						canCompleteTrainings={ false }
					/>
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Orientation")).toBeTruthy()
		expect(screen.queryByText("views.employees.show.trainings.mark_complete")).toBeNull()
	})
})
