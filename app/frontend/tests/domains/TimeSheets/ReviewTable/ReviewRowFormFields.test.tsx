import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Form } from "@/components/Form"
import { ReviewRowFormFields } from "@/domains/TimeSheets/ReviewTable/ReviewRowFormFields"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => {
			if(key === "views.timesheets.employee_review.save_times") return "Save times"
			if(key === "views.timesheets.employee_review.cancel_edit_times") return "Cancel"
			return key
		},
	}),
}))

vi.mock("@/components/Inputs", () => ({
	TimeInput: ({
		name,
		value,
		onChange,
	}: {
		name?: string
		value?: string
		onChange?: (value: string) => void
	}) => (
		<input
			aria-label={ name }
			value={ value ?? "" }
			onChange={ event => onChange?.(event.currentTarget.value) }
		/>
	),
}))

function renderFields(initialData = { start_time: "12:00", end_time: "18:00" }) {
	const onCancel = vi.fn()

	render(
		<MantineProvider theme={ theme }>
			<Form
				method="post"
				action="/reload"
				initialData={ initialData }
				railsAttributes={ false }
			>
				<ReviewRowFormFields
					initialData={ initialData }
					onTimesChange={ () => {} }
					onCancel={ onCancel }
				/>
			</Form>
		</MantineProvider>,
	)

	return { onCancel }
}

describe("ReviewRowFormFields", () => {
	beforeEach(() => {
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

	afterEach(() => {
		cleanup()
	})

	it("shows a green check save control once times are dirty", async () => {
		const user = userEvent.setup()
		renderFields()

		expect(screen.queryByRole("button", { name: "Save times" })).not.toBeInTheDocument()

		await user.clear(screen.getByLabelText("start_time"))
		await user.type(screen.getByLabelText("start_time"), "13:00")

		expect(screen.getByRole("button", { name: "Save times" })).toHaveAttribute("type", "submit")
	})

	it("calls onCancel from the cancel control", async () => {
		const user = userEvent.setup()
		const { onCancel } = renderFields()

		await user.click(screen.getByRole("button", { name: "Cancel" }))

		expect(onCancel).toHaveBeenCalledTimes(1)
	})
})
