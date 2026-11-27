import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
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
		pathname: "/employees",
		path: "/employees",
		params: new URLSearchParams(),
		paramsAsJson: {},
	}),
}))

interface Row {
	id: string
	name: string
}

const columns: TableColumn<Row>[] = [
	{
		accessor: "name",
		title: "Name",
		render: (row) => row.name,
	},
]

const records: Row[] = [
	{ id: "1", name: "Ada" },
	{ id: "2", name: "Grace" },
]

describe("DataTable pagination ownership", () => {
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

	it("does not render pagination inside DataTable", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<Table.Provider model="employees">
					<DataTable
						columns={ columns }
						records={ records }
						model="employees"
						height="auto"
					/>
				</Table.Provider>
			</MantineProvider>,
		)

		expect(screen.queryByLabelText("rows per page")).not.toBeInTheDocument()
		expect(document.querySelectorAll(".mantine-datatable-row")).toHaveLength(2)
	})
})
