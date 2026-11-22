import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { EmployeeRequirements } from "@/domains/Employees/Requirements"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: Record<string, unknown>) => {
			if(key === "views.employees.show.requirements.counts") {
				return `${options?.met} met / ${options?.unmet} unmet / ${options?.total} total`
			}
			return key
		},
	}),
}))

describe("EmployeeRequirements", () => {
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

	it("renders met and unmet requirement item status", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<EmployeeRequirements
					fulfillments={ {
						met_count: 0,
						unmet_count: 1,
						total_count: 1,
						requirements: [
							{
								requirement_id: "req-1",
								name: "Onboarding",
								type_name: "Compliance",
								scope_label: "Company-wide",
								status: "unmet",
								items: [
									{
										fulfillable_id: "training-1",
										fulfillable_type: "Employee::Training",
										kind: "training",
										name: "Orientation",
										status: "met",
									},
									{
										fulfillable_id: "training-2",
										fulfillable_type: "Employee::Training",
										kind: "training",
										name: "Safety",
										status: "unmet",
									},
								],
							},
						],
					} }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText("Onboarding")).toBeTruthy()
		expect(screen.getByText("Orientation")).toBeTruthy()
		expect(screen.getByText("Safety")).toBeTruthy()
		expect(screen.getByText("0 met / 1 unmet / 1 total")).toBeTruthy()
	})
})
