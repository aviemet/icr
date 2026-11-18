import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ShiftTypes } from "@/domains/Settings/Calendar/ShiftTypes"
import { theme } from "@/lib/theme"

const mutateCreate = vi.fn()
const mutateDelete = vi.fn()

vi.mock("@inertiajs/react", () => ({
	router: {
		reload: vi.fn(),
		get: vi.fn(),
	},
}))

vi.mock("@/lib/hooks/useLocation", () => ({
	useLocation: () => ({
		pathname: "/settings/calendar",
		path: "/settings/calendar",
		params: new URLSearchParams(),
		paramsAsJson: {},
	}),
}))

vi.mock("@/queries", () => ({
	useCreateCategory: () => ({
		mutate: (variables: { name: string }, options?: { onSuccess?: () => void }) => {
			mutateCreate(variables)
			options?.onSuccess?.()
		},
		isPending: false,
	}),
	useDeleteCategory: () => ({
		mutate: (variables: { slug: string }, options?: { onSuccess?: () => void }) => {
			mutateDelete(variables)
			options?.onSuccess?.()
		},
		isPending: false,
	}),
}))

const shiftTypes: Schema.Category[] = [
	{ id: "1", slug: "regular", name: "Regular", system: true },
	{ id: "2", slug: "training", name: "Training", system: false },
]

function renderShiftTypes(records: Schema.Category[] = shiftTypes) {
	return render(
		<MantineProvider theme={ theme } defaultColorScheme="dark">
			<ModalsProvider>
				<ShiftTypes shift_types={ records } />
			</ModalsProvider>
		</MantineProvider>,
	)
}

describe("ShiftTypes", () => {
	beforeEach(() => {
		cleanup()
		mutateCreate.mockReset()
		mutateDelete.mockReset()
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

	it("renders a data table for shift type records", () => {
		const { container } = renderShiftTypes()

		expect(container.querySelector(".mantine-datatable")).toBeInTheDocument()
		expect(container.querySelectorAll(".mantine-datatable-row")).toHaveLength(2)
	})

	it("shows empty state when there are no shift types", () => {
		renderShiftTypes([])

		expect(screen.getByText("No shift types yet. Add one below.")).toBeInTheDocument()
	})

	it("creates a shift type from the add section", async () => {
		const user = userEvent.setup()
		renderShiftTypes()

		await user.type(screen.getByLabelText("Name"), "Overnight")
		await user.click(screen.getByRole("button", { name: "Add" }))

		expect(mutateCreate).toHaveBeenCalledWith({ name: "Overnight" })
	})
})
