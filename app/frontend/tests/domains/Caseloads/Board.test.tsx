import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CaseloadsBoard } from "@/domains/Caseloads"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: Record<string, string | number>) => {
			if(key === "views.caseloads.title") return "Caseloads"
			if(key === "views.caseloads.subtitle") return "Assign clients to facilitators"
			if(key === "views.caseloads.metrics.facilitators") return "Facilitators"
			if(key === "views.caseloads.metrics.on_caseload") return "On caseload"
			if(key === "views.caseloads.metrics.unassigned") return "Unassigned"
			if(key === "views.caseloads.roster.title") return "Facilitators"
			if(key === "views.caseloads.roster.caseload_size") return `${options?.count ?? 0} clients`
			if(key === "views.caseloads.clients.title") return "Caseload"
			if(key === "views.caseloads.clients.unassign") return "Unassign"
			if(key === "views.caseloads.unassigned.title") return "Unassigned clients"
			if(key === "views.caseloads.unassigned.assign") return "Assign"
			return key
		},
	}),
}))

vi.mock("@inertiajs/react", () => ({
	Link: ({ children, href, ...props }: { children?: React.ReactNode, href: string }) => (
		<a href={ href } { ...props }>{ children }</a>
	),
	router: {
		post: vi.fn(),
		patch: vi.fn(),
	},
}))

function buildPerson(name: string): Schema.PeoplePersisted {
	const [firstName, lastName = "Test"] = name.split(" ")
	return {
		id: `${name}-person`,
		slug: name.toLowerCase().replace(/\s+/g, "-"),
		first_name: firstName,
		last_name: lastName,
		name,
		agency_role: "Employee",
		login_enabled: false,
		created_at: new Date("2026-01-01"),
		updated_at: new Date("2026-01-01"),
	}
}

function buildBoardProps() {
	const facilitator: Schema.CaseloadsFacilitator = {
		id: "fac-1",
		slug: "ada-facilitator",
		name: "Ada Facilitator",
		full_name: "Ada Facilitator",
		first_name: "Ada",
		last_name: "Facilitator",
		person: buildPerson("Ada Facilitator"),
		created_at: new Date("2026-01-01"),
		updated_at: new Date("2026-01-01"),
	}
	const assignedClient: Schema.CaseloadsClient = {
		id: "client-1",
		slug: "casey-client",
		name: "Casey Client",
		full_name: "Casey Client",
		first_name: "Casey",
		last_name: "Client",
		person: buildPerson("Casey Client"),
		created_at: new Date("2026-01-01"),
		updated_at: new Date("2026-01-01"),
	}
	const unassignedClient: Schema.CaseloadsClient = {
		id: "client-2",
		slug: "una-client",
		name: "Una Client",
		full_name: "Una Client",
		first_name: "Una",
		last_name: "Client",
		person: buildPerson("Una Client"),
		created_at: new Date("2026-01-01"),
		updated_at: new Date("2026-01-01"),
	}
	const assignment: Schema.CaseloadsAssignment = {
		id: "assign-1",
		manager_id: facilitator.id,
		client_id: assignedClient.id,
		starts_at: new Date("2026-01-01"),
		created_at: new Date("2026-01-01"),
		updated_at: new Date("2026-01-01"),
	}

	return {
		facilitators: [facilitator],
		assignments: [assignment],
		clients: [assignedClient],
		unassigned_clients: [unassignedClient],
		client_ids_by_facilitator: { [facilitator.id]: [assignedClient.id] },
		caseload_counts: { [facilitator.id]: 1 },
		facilitator_count: 1,
		clients_on_caseload_count: 1,
		unassigned_count: 1,
	}
}

describe("CaseloadsBoard", () => {
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

	it("renders metrics, roster, caseload clients, and unassigned assign actions", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<CaseloadsBoard { ...buildBoardProps() } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Caseloads")).toBeTruthy()
		expect(screen.getByText("Ada Facilitator")).toBeTruthy()
		expect(screen.getByText("Casey Client")).toBeTruthy()
		expect(screen.getByText("Una Client")).toBeTruthy()
		expect(screen.getByText("Unassign")).toBeTruthy()
		expect(screen.getByText("Assign")).toBeTruthy()
	})
})
