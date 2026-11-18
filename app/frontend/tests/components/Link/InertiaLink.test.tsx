import { router } from "@inertiajs/react"
import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { InertiaLink } from "@/components/Link/InertiaLink"
import { theme } from "@/lib/theme"

describe("InertiaLink", () => {
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

	it("sends non-get methods through router.visit", async () => {
		const user = userEvent.setup()
		const visit = vi.spyOn(router, "visit").mockImplementation(() => router)

		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<InertiaLink href="/settings/departments/legal" as="button" method="delete">
					Delete Legal
				</InertiaLink>
			</MantineProvider>,
		)

		await user.click(screen.getByRole("link", { name: "Delete Legal" }))

		expect(visit).toHaveBeenCalledWith("/settings/departments/legal", {
			method: "delete",
		})
	})
})
