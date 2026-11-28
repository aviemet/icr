import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Form } from "@/components/Form"
import { Switch } from "@/components/Inputs/Switch"
import { theme } from "@/lib/theme"

describe("Switch", () => {
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

	it("reflects a true initial form value and toggles off on click", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme }>
				<Form
					action="/test"
					method="patch"
					initialData={ { settings: { ihss_co_employer: true } } }
				>
					<Switch name="settings.ihss_co_employer" label="Co-employer" />
				</Form>
			</MantineProvider>,
		)

		const toggle = screen.getByRole("switch", { name: "Co-employer" })
		await waitFor(() => {
			expect(toggle).toBeChecked()
		})
		await user.click(toggle)
		expect(toggle).not.toBeChecked()
	})

	it("honors defaultChecked when the form has no value for the field", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme }>
				<Form action="/test" method="post">
					<Switch name="employee.eligible_for_hire" label="Eligible" defaultChecked />
				</Form>
			</MantineProvider>,
		)

		const toggle = screen.getByRole("switch", { name: "Eligible" })
		expect(toggle).toBeChecked()
		await user.click(toggle)
		expect(toggle).not.toBeChecked()
	})

	it("stays controlled by an explicit checked prop", async () => {
		const user = userEvent.setup()
		const handleChange = vi.fn()

		render(
			<MantineProvider theme={ theme }>
				<Switch label="Repeats" checked={ false } onChange={ handleChange } />
			</MantineProvider>,
		)

		const toggle = screen.getByRole("switch", { name: "Repeats" })
		await user.click(toggle)
		expect(handleChange).toHaveBeenCalledTimes(1)
		expect(toggle).not.toBeChecked()
	})
})
