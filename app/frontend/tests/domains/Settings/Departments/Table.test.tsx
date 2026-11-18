import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { DepartmentTable } from "@/domains/Settings/Departments/Table"
import { theme } from "@/lib/theme"

const records: Schema.EmployeeDepartmentsIndex[] = [
	{
		id: "1",
		slug: "support",
		name: "Support",
		description: "Front line care",
		created_at: null,
		updated_at: null,
	},
	{
		id: "2",
		slug: "operations",
		name: "Operations",
		description: null,
		created_at: null,
		updated_at: null,
	},
]

describe("DepartmentTable", () => {
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

	it("renders departments with edit and delete actions", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<ModalsProvider>
					<DepartmentTable records={ records } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Support")).toBeInTheDocument()
		expect(screen.getByText("Front line care")).toBeInTheDocument()
		expect(screen.getByLabelText("Edit Support")).toBeInTheDocument()
		expect(screen.getByLabelText("Delete Support")).toBeInTheDocument()
		expect(screen.getByLabelText("Edit Operations")).toBeInTheDocument()
		expect(screen.queryByText("rows per page")).not.toBeInTheDocument()
	})

	it("shows empty state when there are no departments", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<ModalsProvider>
					<DepartmentTable records={ [] } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("No departments yet. Create one to get started.")).toBeInTheDocument()
	})
})
