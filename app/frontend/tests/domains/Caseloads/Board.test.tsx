import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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
			if(key === "views.caseloads.roster.caseload_size") {
				const count = Number(options?.count ?? 0)
				return count === 1 ? `${count} client` : `${count} clients`
			}
			if(key === "views.caseloads.clients.title") return "Caseload"
			if(key === "views.caseloads.clients.reassign") return "Reassign"
			if(key === "views.caseloads.clients.reassign_title") return "Reassign client"
			if(key === "views.caseloads.clients.reassign_confirm") {
				return `Move ${options?.client ?? ""} from ${options?.facilitator ?? ""}'s caseload?`
			}
			if(key === "views.caseloads.clients.reassign_confirm_button") return "Reassign"
			if(key === "views.caseloads.clients.reassign_cancel") return "Cancel"
			if(key === "views.caseloads.clients.unassign") return "Unassign"
			if(key === "views.caseloads.clients.facilitator_label") return "Facilitator"
			if(key === "views.caseloads.unassigned.title") return "Unassigned clients"
			if(key === "views.caseloads.unassigned.assign") return "Assign"
			if(key === "views.caseloads.unassigned.assign_title") return "Assign client"
			if(key === "views.caseloads.unassigned.assign_confirm") return `Assign ${options?.client ?? ""} to a facilitator?`
			if(key === "views.caseloads.unassigned.assign_confirm_button") return "Assign"
			if(key === "views.caseloads.unassigned.assign_cancel") return "Cancel"
			if(key === "views.caseloads.unassigned.facilitator_label") return "Facilitator"
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

	it("renders facilitator data and client actions", () => {
		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<CaseloadsBoard { ...buildBoardProps() } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Ada Facilitator")).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Casey Client" })).toHaveAttribute("href", "/clients/casey-client")
		expect(screen.getByRole("link", { name: "Una Client" })).toHaveAttribute("href", "/clients/una-client")
		expect(screen.getByRole("button", { name: "Reassign" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Assign" })).toBeInTheDocument()
	})

	it("opens the assign confirm modal from an unassigned client action", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<CaseloadsBoard { ...buildBoardProps() } />
				</ModalsProvider>
			</MantineProvider>,
		)

		await user.click(screen.getByRole("button", { name: "Assign" }))

		expect(await screen.findByText("Assign client")).toBeTruthy()
		expect(screen.getByText("Assign Una Client to a facilitator?")).toBeTruthy()
	})

	it("opens the reassign modal with facilitator options and unassign", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme }>
				<ModalsProvider>
					<CaseloadsBoard { ...buildBoardProps() } />
				</ModalsProvider>
			</MantineProvider>,
		)

		await user.click(screen.getByRole("button", { name: "Reassign" }))

		expect(await screen.findByText("Reassign client")).toBeTruthy()
		expect(screen.getByText("Move Casey Client from Ada Facilitator's caseload?")).toBeTruthy()
		expect(screen.getByLabelText("Facilitator")).toBeTruthy()
		expect(screen.getByRole("button", { name: "Unassign" })).toBeTruthy()
	})
})
