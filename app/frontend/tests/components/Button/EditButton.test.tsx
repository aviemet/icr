import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { EditButton } from "@/components/Button"
import { theme } from "@/lib/theme"

describe("EditButton", () => {
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

	it("renders a compact icon control for href edits", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<EditButton href="/settings/job_titles/attendant/edit" label="Attendant" />
			</MantineProvider>,
		)

		const button = screen.getByLabelText("Edit Attendant")
		expect(button).toBeInTheDocument()
		expect(button.tagName).toBe("A")
		expect(button).toHaveAttribute("href", "/settings/job_titles/attendant/edit")
	})

	it("supports onClick edits without a padded button chrome", async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()

		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<EditButton label="shift" onClick={ onClick } />
			</MantineProvider>,
		)

		await user.click(screen.getByLabelText("Edit shift"))
		expect(onClick).toHaveBeenCalled()
	})
})
