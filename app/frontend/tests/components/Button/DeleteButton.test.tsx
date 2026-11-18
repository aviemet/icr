import { router } from "@inertiajs/react"
import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DeleteButton } from "@/components/Button"
import { theme } from "@/lib/theme"

describe("DeleteButton", () => {
	beforeEach(() => {
		cleanup()
		vi.restoreAllMocks()
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

	it("confirms before deleting", async () => {
		const user = userEvent.setup()
		const deleteVisit = vi.spyOn(router, "delete").mockImplementation(() => router)

		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<ModalsProvider>
					<DeleteButton href="/settings/departments/legal" label="Legal" />
				</ModalsProvider>
			</MantineProvider>,
		)

		await user.click(screen.getByLabelText("Delete Legal"))
		expect(deleteVisit).not.toHaveBeenCalled()

		expect(await screen.findByText("Delete Legal? This cannot be undone.")).toBeInTheDocument()
		await user.click(await screen.findByRole("button", { name: "Delete" }))
		expect(deleteVisit).toHaveBeenCalledWith("/settings/departments/legal")
	})
})
