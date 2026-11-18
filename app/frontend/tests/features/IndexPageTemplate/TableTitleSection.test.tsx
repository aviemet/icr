import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useEffect, useRef } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Table } from "@/components"
import { useTableContext } from "@/components/Table/Provider"
import { IndexTableTitleSection } from "@/features/IndexPageTemplate/TableTitleSection"
import { theme } from "@/lib/theme"

vi.mock("@inertiajs/react", () => ({
	router: {
		visit: vi.fn(),
	},
}))

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: { count?: number }) => {
			if(key === "views.index_template.selected_count") {
				return `${options?.count ?? 0} selected`
			}
			if(key === "views.index_template.delete_selected") return "Delete"
			if(key === "views.index_template.clear_selection") return "Clear"
			return key
		},
	}),
}))

function SelectRecords({ recordIds }: { recordIds: string[] }) {
	const tableContext = useTableContext(false)
	const seeded = useRef(false)

	useEffect(() => {
		if(seeded.current || !tableContext) return
		seeded.current = true
		tableContext.setSelectedRecordIds(recordIds)
	}, [recordIds, tableContext])

	return null
}

describe("IndexTableTitleSection", () => {
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

	it("shows the page title and primary actions when nothing is selected", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<Table.Provider model="employees" selectable>
					<IndexTableTitleSection
						title="Employees"
						actions={ [{ label: "New Employee", href: "/employees/new" }] }
					>
						<span>search</span>
					</IndexTableTitleSection>
				</Table.Provider>
			</MantineProvider>,
		)

		expect(screen.getByRole("heading", { name: "Employees" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "New Employee" })).toHaveAttribute("href", "/employees/new")
		expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument()
	})

	it("swaps to selection actions when records are selected", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<Table.Provider model="employees" selectable>
					<SelectRecords recordIds={ ["1", "2"] } />
					<IndexTableTitleSection
						title="Employees"
						deleteRoute="/employees"
						actions={ [{ label: "New Employee", href: "/employees/new" }] }
					>
						<span>search</span>
					</IndexTableTitleSection>
				</Table.Provider>
			</MantineProvider>,
		)

		expect(await screen.findByRole("heading", { name: "2 selected" })).toBeInTheDocument()
		expect(screen.queryByRole("link", { name: "New Employee" })).not.toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()

		await user.click(screen.getByRole("button", { name: "Clear" }))
		expect(await screen.findByRole("heading", { name: "Employees" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "New Employee" })).toBeInTheDocument()
	})
})
