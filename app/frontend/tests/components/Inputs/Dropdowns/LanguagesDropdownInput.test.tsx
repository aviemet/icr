import { MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Form } from "@/components/Form"
import { LanguagesDropdown } from "@/components/Inputs/Dropdowns/LanguagesDropdownInput"
import { theme } from "@/lib/theme"

vi.mock("@/queries/locale", () => ({
	useGetLanguages: () => ({
		data: [{ value: "en", label: "English" }],
		refetch: vi.fn(),
	}),
}))

describe("LanguagesDropdown", () => {
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

	it("loads language options on mount and matches stored default_language values", async () => {
		const queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		})

		render(
			<QueryClientProvider client={ queryClient }>
				<MantineProvider theme={ theme }>
					<Form
						action="/test"
						method="post"
						initialData={ { settings: { default_language: "en" } } }
					>
						<LanguagesDropdown
							label="Default Language"
							name="settings.default_language"
						/>
					</Form>
				</MantineProvider>
			</QueryClientProvider>,
		)

		await waitFor(() => {
			expect(screen.getByLabelText("Default Language")).toBeInTheDocument()
		})

		expect(document.querySelector('input[name="settings.default_language"]')).toHaveValue("en")
	})
})
