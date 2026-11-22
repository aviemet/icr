import { MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { AppearanceSettings } from "@/domains/Settings/User/Appearance"
import { theme } from "@/lib/theme"

const mutateMock = vi.fn()
const reloadMock = vi.fn()

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

vi.mock("@inertiajs/react", () => ({
	router: {
		reload: (...args: unknown[]) => reloadMock(...args),
	},
}))

vi.mock("@/lib/hooks", () => ({
	usePageProps: () => ({
		auth: {
			user: {
				slug: "test-user",
				user_preferences: {
					dyslexia_font: false,
				},
			},
		},
	}),
}))

vi.mock("@/queries", () => ({
	useUpdateUserPreferences: () => ({
		mutate: mutateMock,
	}),
}))

describe("AppearanceSettings", () => {
	beforeEach(() => {
		cleanup()
		mutateMock.mockReset()
		reloadMock.mockReset()
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

	it("renders the color scheme toggle", () => {
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		})

		render(
			<QueryClientProvider client={ queryClient }>
				<MantineProvider theme={ theme } defaultColorScheme="dark">
					<AppearanceSettings />
				</MantineProvider>
			</QueryClientProvider>,
		)

		expect(screen.getByText("views.settings.user.color_scheme.label")).toBeInTheDocument()
		expect(screen.getByLabelText("Toggle light mode")).toBeInTheDocument()
	})

	it("renders the dyslexia font switch and updates preference on toggle", async () => {
		const user = userEvent.setup()
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		})

		render(
			<QueryClientProvider client={ queryClient }>
				<MantineProvider theme={ theme } defaultColorScheme="dark">
					<AppearanceSettings />
				</MantineProvider>
			</QueryClientProvider>,
		)

		expect(screen.getByText("views.settings.user.dyslexia_font.label")).toBeInTheDocument()

		const dyslexiaSwitch = screen.getByLabelText("views.settings.user.dyslexia_font.label")
		await user.click(dyslexiaSwitch)

		expect(mutateMock).toHaveBeenCalledWith(
			{ dyslexia_font: true },
			expect.objectContaining({
				onSuccess: expect.any(Function),
			}),
		)
	})
})
