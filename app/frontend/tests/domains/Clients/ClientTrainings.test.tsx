import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ClientTrainings } from "@/domains/Clients/Trainings"
import { theme } from "@/lib/theme"

let canCreateTraining = false

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: Record<string, string | number>) => {
			if(key === "views.trainings.index.minutes") return `${options?.count} min`
			return key
		},
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
	useRecordCanUpdate: () => false,
	usePermissions: () => ({
		can: (resource: string, action: string) => (
			resource === "employee/trainings" && action === "create" && canCreateTraining
		),
	}),
}))

function buildClient(overrides: Partial<Schema.ClientsShow> = {}): Schema.ClientsShow {
	return {
		id: "client-1",
		slug: "jane-doe",
		name: "Jane Doe",
		full_name: "Jane Doe",
		first_name: "Jane",
		last_name: "Doe",
		person_id: "person-1",
		person: { id: "person-1", name: "Jane Doe" } as Schema.PeopleShow,
		active_allergies_count: 0,
		active_prescriptions_count: 0,
		allergies: [],
		clients_attendants: [],
		clients_managers: [],
		clients_trainings: [
			{
				id: "ct-1",
				client_id: "client-1",
				training_id: "tr-1",
				required: true,
				training: {
					id: "tr-1",
					name: "Client-Specific Safety",
					description: "Safety briefing",
					estimated_minutes: 45,
					status: "active",
					created_at: new Date("2024-01-01"),
					updated_at: new Date("2024-01-01"),
				},
				created_at: new Date("2024-01-01"),
				updated_at: new Date("2024-01-01"),
			},
		],
		color_mappings: {},
		created_at: new Date("2024-01-01"),
		current_attendants: [],
		current_manager: null as unknown as Schema.EmployeesPersisted,
		diagnoses: [],
		doctors: [],
		doctors_clients: [],
		documents: [],
		emergency_contacts_count: 0,
		enrollments: [],
		hospital_visits: [],
		household: null as unknown as Schema.HouseholdsPersisted,
		images: [],
		incident_reports: [],
		incident_reports_count: 0,
		life_detail: null as unknown as Schema.ClientLifeDetailsPersisted,
		links: [],
		prescriptions: [],
		support_contacts: [],
		updated_at: new Date("2024-01-01"),
		...overrides,
	}
}

function renderClientTrainings(client = buildClient()) {
	return render(
		<MantineProvider theme={ theme }>
			<ModalsProvider>
				<ClientTrainings client={ client } trainingOptions={ [] } />
			</ModalsProvider>
		</MantineProvider>,
	)
}

describe("ClientTrainings", () => {
	beforeEach(() => {
		cleanup()
		canCreateTraining = false
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

	it("renders associated trainings and required state", () => {
		renderClientTrainings()

		expect(screen.getByText("Client-Specific Safety")).toBeTruthy()
		expect(screen.getByText("views.clients.show.trainings.required_yes")).toBeTruthy()
		expect(screen.getByText("45 min")).toBeTruthy()
	})

	it("hides New Training when create permission is false", () => {
		renderClientTrainings()

		expect(screen.queryByText("views.clients.show.trainings.new")).toBeNull()
	})

	it("shows New Training with client_ids prefill when create permission is true", () => {
		canCreateTraining = true
		const client = buildClient()
		renderClientTrainings(client)

		const link = screen.getByText("views.clients.show.trainings.new").closest("a")
		expect(link).toBeTruthy()
		expect(link?.getAttribute("href")).toContain(client.id)
		expect(link?.getAttribute("href")).toContain("client_ids")
	})
})
