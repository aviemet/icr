import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { Table } from "@/components"
import { theme } from "@/lib/theme"

type Row = {
	id: string
	name: string
}

function renderTable({
	data,
	emptyMessage,
	showOptionalColumn = false,
}: {
	data: readonly Row[]
	emptyMessage?: React.ReactNode
	showOptionalColumn?: boolean
}) {
	return render(
		<MantineProvider theme={ theme }>
			<Table data={ data } emptyMessage={ emptyMessage }>
				<Table.Head>
					<Table.Row>
						<Table.HeadCell>Name</Table.HeadCell>
						<Table.HeadCell>Id</Table.HeadCell>
						{ showOptionalColumn && (
							<Table.HeadCell>Extra</Table.HeadCell>
						) }
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.RowIterator>
						{ (row: Row) => (
							<Table.Row key={ row.id }>
								<Table.Cell>{ row.name }</Table.Cell>
								<Table.Cell>{ row.id }</Table.Cell>
								{ showOptionalColumn && (
									<Table.Cell>extra</Table.Cell>
								) }
							</Table.Row>
						) }
					</Table.RowIterator>
				</Table.Body>
			</Table>
		</MantineProvider>,
	)
}

describe("Table.RowIterator", () => {
	beforeEach(() => {
		cleanup()
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: (query: string) => ({
				matches: false,
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

	it("renders the default empty message when data is empty", () => {
		renderTable({ data: [] })

		expect(screen.getByText("Nothing to display")).toBeInTheDocument()
	})

	it("renders a custom empty message", () => {
		renderTable({ data: [], emptyMessage: "No rows yet" })

		expect(screen.getByText("No rows yet")).toBeInTheDocument()
	})

	it("iterates data into row children", () => {
		renderTable({
			data: [
				{ id: "1", name: "Ada" },
				{ id: "2", name: "Grace" },
			],
		})

		expect(screen.getByText("Ada")).toBeInTheDocument()
		expect(screen.getByText("Grace")).toBeInTheDocument()
		expect(screen.queryByText("Nothing to display")).not.toBeInTheDocument()
	})

	it("sets empty cell colspan from HeadCell count", () => {
		const { rerender } = renderTable({ data: [] })

		const emptyCell = screen.getByText("Nothing to display").closest("td")
		expect(emptyCell).toHaveAttribute("colspan", "2")

		rerender(
			<MantineProvider theme={ theme }>
				<Table data={ [] }>
					<Table.Head>
						<Table.Row>
							<Table.HeadCell>Name</Table.HeadCell>
							<Table.HeadCell>Id</Table.HeadCell>
							<Table.HeadCell>Extra</Table.HeadCell>
						</Table.Row>
					</Table.Head>
					<Table.Body>
						<Table.RowIterator>
							{ (row: Row) => (
								<Table.Row key={ row.id }>
									<Table.Cell>{ row.name }</Table.Cell>
								</Table.Row>
							) }
						</Table.RowIterator>
					</Table.Body>
				</Table>
			</MantineProvider>,
		)

		const nextEmptyCell = screen.getByText("Nothing to display").closest("td")
		expect(nextEmptyCell).toHaveAttribute("colspan", "3")
	})

	it("keeps empty colspan in sync when a conditional HeadCell mounts", () => {
		const { rerender } = renderTable({ data: [], showOptionalColumn: false })

		expect(screen.getByText("Nothing to display").closest("td")).toHaveAttribute("colspan", "2")

		rerender(
			<MantineProvider theme={ theme }>
				<Table data={ [] }>
					<Table.Head>
						<Table.Row>
							<Table.HeadCell>Name</Table.HeadCell>
							<Table.HeadCell>Id</Table.HeadCell>
							<Table.HeadCell>Extra</Table.HeadCell>
						</Table.Row>
					</Table.Head>
					<Table.Body>
						<Table.RowIterator>
							{ () => null }
						</Table.RowIterator>
					</Table.Body>
				</Table>
			</MantineProvider>,
		)

		const table = screen.getByRole("table")
		expect(within(table).getByText("Nothing to display").closest("td")).toHaveAttribute("colspan", "3")
	})
})
