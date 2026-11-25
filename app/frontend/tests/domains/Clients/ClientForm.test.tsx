import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ClientForm } from "@/domains/Clients/Form"
import { theme } from "@/lib/theme"

vi.mock("@inertiajs/react", () => ({
	Form: ({ children }: { children?: React.ReactNode }) => <form>{ children }</form>,
	useFormContext: () => null,
	router: {
		visit: vi.fn(),
		reload: vi.fn(),
	},
}))

function buildClient(overrides: Partial<Schema.ClientsFormData> = {}): Schema.ClientsFormData {
	return {
		first_name: "",
		full_name: "",
		last_name: "",
		name: "",
		person: {
			agency_role: "Client",
			login_enabled: false,
			name: "",
			first_name: "",
			last_name: "",
		},
		person_id: "",
		color_mappings: {},
		...overrides,
	}
}

describe("ClientForm", () => {
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

	it("marks first and last name as required", () => {
		render(
			<MantineProvider theme={ theme }>
				<ClientForm to="/clients" client={ buildClient() } />
			</MantineProvider>,
		)

		expect(screen.getByRole("textbox", { name: /First Name/ })).toBeRequired()
		expect(screen.getByRole("textbox", { name: /Last Name/ })).toBeRequired()
		expect(screen.getByRole("textbox", { name: /Middle Name/ })).not.toBeRequired()
		expect(screen.getByRole("textbox", { name: /Client #/ })).not.toBeRequired()
	})

	it("omits preferred hospital", () => {
		render(
			<MantineProvider theme={ theme }>
				<ClientForm to="/clients" client={ buildClient() } />
			</MantineProvider>,
		)

		expect(screen.queryByRole("textbox", { name: /Preferred Hospital/ })).toBeNull()
		expect(screen.getByRole("textbox", { name: /Preferred Language/ })).toBeTruthy()
	})
})
