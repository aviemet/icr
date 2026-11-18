import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DepartmentTable } from "@/domains/Settings/Departments/Table"
import { theme } from "@/lib/theme"

vi.mock("@inertiajs/react", () => ({
	router: {
		get: vi.fn(),
		visit: vi.fn(),
		reload: vi.fn(),
	},
}))

vi.mock("@/lib/hooks/useLocation", () => ({
	useLocation: () => ({
		pathname: "/settings/departments",
		path: "/settings/departments",
		params: new URLSearchParams(),
		paramsAsJson: {},
	}),
}))

const records: Schema.EmployeeDepartmentsIndex[] = [
	{
		id: "1",
		slug: "hourly",
		name: "Hourly",
		description: "Front line care",
		created_at: new Date("2024-01-01"),
		updated_at: new Date("2024-01-01"),
	},
	{
		id: "2",
		slug: "executive",
		name: "Executive",
		created_at: new Date("2024-01-01"),
		updated_at: new Date("2024-01-01"),
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

	it("renders a data table for department records", () => {
		const { container } = render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<ModalsProvider>
					<DepartmentTable records={ records } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(container.querySelector(".mantine-datatable")).toBeInTheDocument()
		expect(container.querySelectorAll(".mantine-datatable-row")).toHaveLength(2)
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
