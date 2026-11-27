import { MantineProvider } from "@mantine/core"
import { cleanup, render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Table, DataTable, type TableColumn } from "@/components"
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
		pathname: "/clients",
		path: "/clients",
		params: new URLSearchParams(),
		paramsAsJson: {},
		search: "",
	}),
}))

interface Row {
	id: string
	name: string
}

const records: Row[] = [
	{ id: "1", name: "Ada" },
]

function UnstableColumnsTable() {
	const columns: TableColumn<Row>[] = [
		{
			accessor: "name",
			title: "Name",
			render: (row) => row.name,
		},
	]

	return (
		<Table.Provider model="clients">
			<DataTable
				columns={ columns }
				records={ records }
				model="clients"
				height="auto"
			/>
		</Table.Provider>
	)
}

describe("DataTable column sync", () => {
	beforeEach(() => {
		cleanup()
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: (query: string) => ({
				matches: true,
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			}),
		})
	})

	it("does not loop when columns are a new array each render", () => {
		expect(() => {
			render(
				<MantineProvider theme={ theme } defaultColorScheme="dark">
					<UnstableColumnsTable />
				</MantineProvider>,
			)
		}).not.toThrow()

		expect(document.querySelectorAll(".mantine-datatable-row")).toHaveLength(1)
	})

	it("center-aligns Actions column headers", () => {
		const { container } = render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<Table.Provider model="clients">
					<DataTable
						columns={ [
							{
								accessor: "name",
								title: "Name",
								render: (row) => row.name,
							},
							{
								accessor: "actions",
								title: "Actions",
								titleClassName: "actionsCell",
								cellsClassName: "actionsCell",
								render: () => null,
							},
						] }
						records={ records }
						model="clients"
						height="auto"
					/>
				</Table.Provider>
			</MantineProvider>,
		)

		const actionsHeader = Array.from(container.querySelectorAll("th")).find(
			(header) => header.textContent?.includes("Actions"),
		)
		expect(actionsHeader).toBeDefined()
		expect(actionsHeader).toHaveClass("actionsCell")

		const actionsTitle = actionsHeader?.querySelector(".mantine-datatable-header-cell-sortable-text")
		expect(actionsTitle).not.toBeNull()
		expect(actionsTitle).toHaveClass("mantine-datatable-text-align-center")
	})
})
