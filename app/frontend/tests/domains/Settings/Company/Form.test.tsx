import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CompanyForm } from "@/domains/Settings/Company/Form"
import { theme } from "@/lib/theme"

vi.mock("@inertiajs/react", () => ({
	Form: ({ children }: { children?: React.ReactNode }) => <form>{ children }</form>,
	useFormContext: () => null,
	Link: ({ children, href, ...props }: { children?: React.ReactNode, href: string }) => (
		<a href={ href } { ...props }>{ children }</a>
	),
	router: {
		visit: vi.fn(),
		reload: vi.fn(),
	},
}))

vi.mock("@/components/Inputs/Dropdowns", () => ({
	CategoriesDropdown: ({ label }: { label?: string }) => <label>{ label }</label>,
}))

function buildCompany(overrides: Partial<Schema.CompaniesShow> = {}): Schema.CompaniesShow {
	return {
		id: "company-1",
		name: "ICR SLS",
		contact: {
			id: "contact-1",
			addresses: [],
			phones: [],
		},
		addresses: [],
		phones: [],
		...overrides,
	} as Schema.CompaniesShow
}

describe("CompanyForm", () => {
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

	it("opens add address modal instead of inline dynamic fields", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme }>
				<CompanyForm company={ buildCompany() } />
			</MantineProvider>,
		)

		expect(screen.getByText("No addresses yet.")).toBeInTheDocument()
		expect(screen.getByText("No phone numbers yet.")).toBeInTheDocument()

		await user.click(screen.getByRole("button", { name: "Add address" }))
		const dialog = await screen.findByRole("dialog")
		expect(dialog).toBeInTheDocument()
		expect(dialog).toHaveTextContent("Address")
		expect(dialog).toHaveTextContent("Add")
	})
})
