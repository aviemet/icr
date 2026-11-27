import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ReviewRowTimes } from "@/domains/TimeSheets/ReviewTable/ReviewRowTimes"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const labels: Record<string, string> = {
				"views.timesheets.employee_review.times": "times",
				"views.timesheets.employee_review.save_times": "Save times",
				"views.timesheets.employee_review.cancel_edit_times": "Cancel",
			}
			return labels[key] ?? key
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

describe("ReviewRowTimes", () => {
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

	it("shows formatted times with an edit control, then inputs after edit", async () => {
		const user = userEvent.setup()
		const onCancelEdit = vi.fn()

		render(
			<MantineProvider theme={ theme }>
				<ReviewRowTimes
					canEdit
					startsAt={ new Date("2024-03-18T20:00:00.000Z") }
					endsAt={ new Date("2024-03-19T02:00:00.000Z") }
					initialData={ { start_time: "12:00", end_time: "18:00" } }
					reloadHref="/reload"
					submitWith={ () => Promise.resolve() }
					onTimesChange={ () => {} }
					onCancelEdit={ onCancelEdit }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText(/\d{2}:\d{2} [AP]M - \d{2}:\d{2} [AP]M/)).toBeInTheDocument()
		expect(screen.queryByLabelText("start_time")).not.toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Edit times" })).toBeInTheDocument()

		await user.click(screen.getByRole("button", { name: "Edit times" }))

		expect(screen.getByLabelText("start_time")).toBeInTheDocument()
		expect(screen.getByLabelText("end_time")).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
	})
})
