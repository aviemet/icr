import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { Form } from "@/components/Form"
import { RadioGroup } from "@/components/Inputs/RadioGroup"
import { theme } from "@/lib/theme"

describe("RadioGroup", () => {
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

	it("updates the form field when a radio is selected", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme }>
				<Form
					action="/test"
					method="post"
					initialData={ { period: "hourly" } }
				>
					<RadioGroup
						name="period"
						label="Frequency"
						options={ [
							{ value: "hourly", label: "Hourly" },
							{ value: "salary", label: "Salary" },
						] }
					/>
				</Form>
			</MantineProvider>,
		)

		await waitFor(() => {
			expect(screen.getByRole("radio", { name: "Hourly" })).toBeChecked()
		})
		await user.click(screen.getByRole("radio", { name: "Salary" }))
		expect(screen.getByRole("radio", { name: "Salary" })).toBeChecked()
	})
})
