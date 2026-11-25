import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { HouseholdForm } from "@/domains/Households/Form"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

vi.mock("@inertiajs/react", () => ({
	Form: ({ children }: { children?: React.ReactNode }) => <form>{ children }</form>,
	useFormContext: () => null,
	router: {
		visit: vi.fn(),
		reload: vi.fn(),
	},
}))

function buildHousehold(overrides: Partial<Schema.HouseholdsFormData> = {}): Schema.HouseholdsFormData {
	return {
		name: "",
		clients: [],
		contact: {
			id: "contact-1",
			contactable_id: "",
			contactable_type: "Household",
			addresses: [],
			emails: [],
			phones: [],
			created_at: new Date("2024-01-01"),
			updated_at: new Date("2024-01-01"),
		},
		...overrides,
	}
}

describe("HouseholdForm", () => {
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

	it("requires the household name", () => {
		render(
			<MantineProvider theme={ theme }>
				<HouseholdForm to="/households" household={ buildHousehold() } />
			</MantineProvider>,
		)

		expect(screen.getByRole("textbox", { name: "views.households.form.name" })).toBeRequired()
		expect(screen.getByRole("button", { name: "views.households.form.create" })).toBeTruthy()
	})

	it("shows update label for a persisted household", () => {
		render(
			<MantineProvider theme={ theme }>
				<HouseholdForm
					to="/households/santos-home"
					method="put"
					household={ buildHousehold({ id: "hh-1", name: "Santos Home", slug: "santos-home" }) }
				/>
			</MantineProvider>,
		)

		expect(screen.getByRole("button", { name: "views.households.form.update" })).toBeTruthy()
	})
})
