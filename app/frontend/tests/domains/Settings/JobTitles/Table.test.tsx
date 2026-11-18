import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { JobTitleTable } from "@/domains/Settings/JobTitles/Table"
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
		pathname: "/settings/job_titles",
		path: "/settings/job_titles",
		params: new URLSearchParams(),
		paramsAsJson: {},
	}),
}))

const records: Schema.EmployeeJobTitlesIndex[] = [
	{
		id: "1",
		slug: "attendant",
		name: "Attendant",
		description: "Frontline hourly employee",
		department_id: "d1",
		department: { id: "d1", slug: "hourly", name: "Hourly", description: "" },
		created_at: null,
		updated_at: null,
	},
	{
		id: "2",
		slug: "director",
		name: "Director",
		description: null,
		department_id: null,
		department: { name: "", description: "" },
		created_at: null,
		updated_at: null,
	},
]

describe("JobTitleTable", () => {
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

	it("renders a data table for job title records", () => {
		const { container } = render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<ModalsProvider>
					<JobTitleTable records={ records } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(container.querySelector(".mantine-datatable")).toBeInTheDocument()
		expect(container.querySelectorAll(".mantine-datatable-row")).toHaveLength(2)
		expect(screen.queryByText("rows per page")).not.toBeInTheDocument()
	})

	it("shows empty state when there are no job titles", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<ModalsProvider>
					<JobTitleTable records={ [] } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("No job titles yet. Create one to get started.")).toBeInTheDocument()
	})
})
