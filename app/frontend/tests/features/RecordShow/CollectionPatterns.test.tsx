import { MantineProvider } from "@mantine/core"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
	CollectionAddModal,
	CollectionPanel,
	DropzoneField,
	MetricTile,
	RecordRow,
	ShowEditToggle,
} from "@/features/RecordShow"
import { theme } from "@/lib/theme"

describe("RecordShow collection patterns", () => {
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

	it("renders metric tile and collection rows", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<MetricTile title="Health Alerts" tone="alert">
					<span>2 allergies</span>
				</MetricTile>
				<CollectionPanel title="Allergies" count={ 1 } emptyLabel="None">
					<RecordRow title="Penicillin" meta={ <span>severe</span> } />
				</CollectionPanel>
			</MantineProvider>,
		)

		expect(screen.getByText("Health Alerts")).toBeInTheDocument()
		expect(screen.getByText("2 allergies")).toBeInTheDocument()
		expect(screen.getByText("Allergies")).toBeInTheDocument()
		expect(screen.getByText("Penicillin")).toBeInTheDocument()
	})

	it("opens CollectionAddModal form on trigger when canUpdate", async () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<CollectionAddModal canUpdate={ true } label="Add Allergy">
					<button type="button">Save allergy</button>
				</CollectionAddModal>
			</MantineProvider>,
		)

		fireEvent.click(screen.getByRole("button", { name: "Add Allergy" }))
		expect(await screen.findByRole("button", { name: "Save allergy" })).toBeInTheDocument()
	})

	it("hides CollectionAddModal trigger when canUpdate is false", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<CollectionAddModal canUpdate={ false } label="Add Allergy">
					<button type="button">Save allergy</button>
				</CollectionAddModal>
			</MantineProvider>,
		)

		expect(screen.queryByRole("button", { name: "Add Allergy" })).not.toBeInTheDocument()
	})

	it("toggles ShowEditToggle between show and edit", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<ShowEditToggle
					canUpdate={ true }
					show={ <div>Show profile</div> }
					edit={ <input aria-label="First name" /> }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText("Show profile")).toBeInTheDocument()
		expect(screen.queryByLabelText("First name")).not.toBeInTheDocument()

		fireEvent.click(screen.getByRole("button", { name: "Edit" }))
		expect(screen.getByLabelText("First name")).toBeInTheDocument()

		fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
		expect(screen.getByText("Show profile")).toBeInTheDocument()
	})

	it("hides edit control when canUpdate is false", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<ShowEditToggle
					canUpdate={ false }
					show={ <div>Show only</div> }
					edit={ <input aria-label="Secret field" /> }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText("Show only")).toBeInTheDocument()
		expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument()
		expect(screen.queryByLabelText("Secret field")).not.toBeInTheDocument()
	})

	it("exposes a file input through DropzoneField", () => {
		const onSelect = vi.fn()

		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<DropzoneField label="Upload Document" hint="PDF" onSelect={ onSelect } />
			</MantineProvider>,
		)

		expect(screen.getByText("Upload Document")).toBeInTheDocument()
		const input = document.querySelector("input[type='file']")
		expect(input).not.toBeNull()
		if(!input) return

		const file = new File(["doc"], "note.pdf", { type: "application/pdf" })
		fireEvent.change(input, { target: { files: [file] } })
		expect(onSelect).toHaveBeenCalled()
	})
})
