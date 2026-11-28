import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Form } from "@/components/Form"
import { Inputs } from "@/domains/Employees/Form/Inputs"
import { theme } from "@/lib/theme"

vi.mock("@/components/Inputs/Dropdowns", () => ({
	JobTitlesDropdown: ({ name, label }: { name: string, label?: string }) => (
		<label>
			{ label || "Job Title" }
			<input name={ name } />
		</label>
	),
}))

vi.mock("@/components/RichTextEditor", () => ({
	RichTextEditor: ({ children, onChange }: { children?: string, onChange?: (value: string) => void }) => (
		<textarea
			aria-label="rich-text"
			defaultValue={ children }
			onChange={ (event) => onChange?.(event.target.value) }
		/>
	),
}))

function buildEmployee(overrides: Partial<Schema.EmployeesFormData> = {}): Schema.EmployeesFormData {
	return {
		status: "applicant",
		desired_compensation_currency: "USD",
		desired_compensation_period: "hourly",
		eligible_for_hire: true,
		first_name: "",
		full_name: "",
		last_name: "",
		name: "",
		person: { id: "person-1" } as Schema.Person,
		person_id: "person-1",
		job_title: {} as Schema.EmployeeJobTitle,
		color_mappings: {},
		...overrides,
		overtime_policy: overrides.overtime_policy ?? "standard",
	}
}

describe("Employee Form Inputs", () => {
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

	it("puts compensation in employment details and keeps application uploads", async () => {
		const employee = buildEmployee()

		render(
			<MantineProvider theme={ theme }>
				<Form
					action="/employees"
					method="post"
					initialData={ { employee } }
				>
					<Inputs employee={ employee } />
				</Form>
			</MantineProvider>,
		)

		await waitFor(() => {
			expect(screen.getByLabelText("Desired Compensation")).toBeInTheDocument()
		})
		expect(screen.getByText("Frequency")).toBeInTheDocument()
		expect(screen.getByRole("radio", { name: "Hourly" })).toBeInTheDocument()
		expect(screen.getByRole("radio", { name: "Salary" })).toBeInTheDocument()
		expect(screen.queryByLabelText("Desired Job Title")).not.toBeInTheDocument()
		expect(screen.getByLabelText("Resume")).toBeInTheDocument()
		expect(screen.getByLabelText("Cover Letter")).toBeInTheDocument()
		expect(screen.getByText("Hiring Notes")).toBeInTheDocument()
	})
})
