import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { EmployeeHiring } from "@/domains/Employees/Hiring"
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
		status: "applicant",
		application_source: "Referral",
		desired_compensation: { amount: 22, cents: 2200, currency_iso: "USD" },
		desired_compensation_currency: "USD",
		desired_compensation_period: "hourly",
		desired_job_title: { id: "jt-1", name: "Caregiver" } as Schema.EmployeeJobTitle,
		hiring_notes: "<p>Strong references</p>",
		resume: {
			id: "resume-1",
			filename: "ada.pdf",
			content_type: "application/pdf",
			byte_size: 10,
			url: "/files/ada.pdf",
			created_at: new Date("2024-01-01"),
		},
		cover_letter: {
			id: "cover-1",
			filename: "cover.pdf",
			content_type: "application/pdf",
			byte_size: 10,
			url: "/files/cover.pdf",
			created_at: new Date("2024-01-01"),
		},
		assigned_clients_count: 0,
		incomplete_trainings_count: 0,
		expiring_credentials_count: 0,
		expiring_clearances_count: 0,
		emergency_contacts_count: 0,
		primary_manager: {} as Schema.EmployeesPersisted,
		interviews: [
			{
				id: "interview-1",
				employee_id: "employee-1",
				interview_notes: [],
				interview_type: "Phone",
				location: "Zoom",
				scheduled_at: new Date("2024-02-01T10:00:00Z"),
				created_at: new Date("2024-01-01"),
				updated_at: new Date("2024-01-01"),
			},
		],
		offers: [
			{
				id: "offer-1",
				employee_id: "employee-1",
				job_title: { id: "jt-1", name: "Caregiver" } as Schema.EmployeeJobTitle,
				job_title_id: "jt-1",
				period: "hourly",
				rate: { amount: 22, cents: 2200, currency_iso: "USD" },
				rate_cents: 2200,
				rate_currency: "USD",
				status: "extended",
				created_at: new Date("2024-01-02"),
				updated_at: new Date("2024-01-02"),
			},
		],
		attended_clients: [],
		clearances: [],
		clients_attendants: [],
		clients_managers: [],
		color_mappings: {},
		created_at: new Date("2024-01-01"),
		credentials: [],
		documents: [],
		eligible_for_hire: true,
		employees_trainings: [],
		identifications: [],
		images: [],
		job_title: { id: "jt-1", name: "Caregiver" } as Schema.EmployeeJobTitle,
		managed_clients: [],
		managers_employees_managers: [],
		pay_rates: [],
		support_contacts: [],
		updated_at: new Date("2024-01-01"),
		...overrides,
		overtime_policy: overrides.overtime_policy ?? "standard",
	}
}

describe("EmployeeHiring", () => {
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

	it("renders application data and document links", () => {
		render(
			<MantineProvider theme={ theme }>
				<EmployeeHiring employee={ buildEmployee() } />
			</MantineProvider>,
		)

		expect(screen.getByText("Referral")).toBeInTheDocument()
		expect(screen.getByText("$22.00 (hourly)")).toBeInTheDocument()
		expect(screen.getByText("Strong references")).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "ada.pdf" })).toHaveAttribute("href", "/files/ada.pdf")
		expect(screen.getByRole("link", { name: "cover.pdf" })).toHaveAttribute("href", "/files/cover.pdf")
		expect(screen.getByText("Caregiver - $22.00 (hourly)")).toBeInTheDocument()
		expect(screen.getByText("Phone - Zoom")).toBeInTheDocument()
	})

	it("hides edit controls when the record cannot be updated", () => {
		render(
			<MantineProvider theme={ theme }>
				<EmployeeHiring employee={ buildEmployee() } />
			</MantineProvider>,
		)

		expect(screen.queryByText("views.employees.show.hiring.add_offer")).not.toBeInTheDocument()
		expect(screen.queryByText("Update")).not.toBeInTheDocument()
	})

})
