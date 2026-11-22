import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { Form } from "@/components/Form"
import { CurrencyInput } from "@/components/Inputs/CurrencyInput"
import { theme } from "@/lib/theme"

describe("CurrencyInput", () => {
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

	it("formats the display while keeping a numeric form value", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme }>
				<Form
					action="/test"
					method="post"
					initialData={ { rate: "" } }
				>
					<CurrencyInput name="rate" label="Rate" />
				</Form>
			</MantineProvider>,
		)

		const input = screen.getByLabelText("Rate")
		await user.type(input, "1234567.89")

		expect(input).toHaveValue("1,234,567.89")
		expect(document.querySelector('input[type="hidden"][name="rate"]')).toHaveValue("1234567.89")
	})

	it("uses locale-specific display separators when locale is overridden", async () => {
		const user = userEvent.setup()

		render(
			<MantineProvider theme={ theme }>
				<Form
					action="/test"
					method="post"
					initialData={ { rate: "" } }
				>
					<CurrencyInput name="rate" label="Rate" locale="de-DE" currency="EUR" />
				</Form>
			</MantineProvider>,
		)

		const input = screen.getByLabelText("Rate")
		await user.type(input, "1234567,89")

		expect(input).toHaveValue("1.234.567,89")
		expect(document.querySelector('input[type="hidden"][name="rate"]')).toHaveValue("1234567.89")
	})
})
