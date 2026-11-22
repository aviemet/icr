import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RequirementShowDetails } from "@/domains/Settings/Requirements/Show"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

describe("RequirementShowDetails", () => {
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

	it("lists type, scope, and fulfillable trainings", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<RequirementShowDetails
					requirement={ {
						id: "req-1",
						name: "Onboarding",
						type_name: "Compliance",
						scope_label: "Company-wide",
						requirement_type_id: "type-1",
						credential_types: [],
						enforcement: "advisory",
						training_ids: ["training-1"],
						requirement_items: [
							{
								id: "item-1",
								fulfillable_id: "training-1",
								fulfillable_type: "Employee::Training",
								credential_type: "cpr",
								kind: "training",
								name: "Orientation",
								created_at: new Date("2024-01-01"),
								updated_at: new Date("2024-01-01"),
							},
						],
						created_at: new Date("2024-01-01"),
						updated_at: new Date("2024-01-01"),
					} }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText(/Compliance/)).toBeTruthy()
		expect(screen.getByText(/Company-wide/)).toBeTruthy()
		expect(screen.getByText("Orientation (training)")).toBeTruthy()
	})
})
