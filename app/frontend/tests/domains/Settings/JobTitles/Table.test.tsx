import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { JobTitleTable } from "@/domains/Settings/JobTitles/Table"
import { theme } from "@/lib/theme"

const records: Schema.EmployeeJobTitlesIndex[] = [
	{
		id: "1",
		slug: "attendant",
		name: "Attendant",
		description: "Front line support",
		department_id: "d1",
		department: { id: "d1", slug: "support", name: "Support", description: "" },
		created_at: null,
		updated_at: null,
	},
	{
		id: "2",
		slug: "director",
		name: "Director",
		description: null,
		department_id: null,
		department: { id: null, slug: null, name: "", description: "" },
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

	it("renders titles with edit and delete actions", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<ModalsProvider>
					<JobTitleTable records={ records } />
				</ModalsProvider>
			</MantineProvider>,
		)

		expect(screen.getByText("Attendant")).toBeInTheDocument()
		expect(screen.getByText("Support")).toBeInTheDocument()
		expect(screen.getByLabelText("Edit Attendant")).toBeInTheDocument()
		expect(screen.getByLabelText("Delete Attendant")).toBeInTheDocument()
		expect(screen.getByLabelText("Edit Director")).toBeInTheDocument()
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
