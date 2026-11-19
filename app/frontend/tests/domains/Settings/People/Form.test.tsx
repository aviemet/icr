import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PersonForm } from "@/domains/Settings/People/Form"
import { theme } from "@/lib/theme"

vi.mock("@inertiajs/react", () => ({
	Form: ({ children }: { children?: React.ReactNode }) => <form>{ children }</form>,
	useFormContext: () => null,
	router: {
		visit: vi.fn(),
		reload: vi.fn(),
	},
}))

function buildPerson(overrides: Partial<Schema.PeopleFormData> = {}): Schema.PeopleFormData {
	return {
		id: "person-1",
		slug: "ada-lovelace",
		first_name: "Ada",
		last_name: "Lovelace",
		middle_name: "Augusta",
		nick_name: "Ada",
		name: "Ada Lovelace",
		agency_role: "Employee",
		login_enabled: true,
		...overrides,
	}
}

describe("PersonForm", () => {
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

	it("renders permitted identity fields without email or password", () => {
		render(
			<MantineProvider theme={ theme }>
				<PersonForm
					to="/settings/people/ada-lovelace"
					method="put"
					person={ buildPerson() }
				/>
			</MantineProvider>,
		)

		expect(screen.getByLabelText("First Name")).toBeInTheDocument()
		expect(screen.getByLabelText("Middle Name")).toBeInTheDocument()
		expect(screen.getByLabelText("Last Name")).toBeInTheDocument()
		expect(screen.getByLabelText("Nickname")).toBeInTheDocument()
		expect(screen.queryByLabelText("Email")).not.toBeInTheDocument()
		expect(screen.queryByLabelText("Password")).not.toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Update Person" })).toBeInTheDocument()
	})
})
