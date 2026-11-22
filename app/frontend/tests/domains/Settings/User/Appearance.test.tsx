import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { AppearanceSettings } from "@/domains/Settings/User/Appearance"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

describe("AppearanceSettings", () => {
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

	it("renders the color scheme toggle", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<AppearanceSettings />
			</MantineProvider>,
		)

		expect(screen.getByText("views.settings.user.color_scheme.label")).toBeInTheDocument()
		expect(screen.getByLabelText("Toggle light mode")).toBeInTheDocument()
	})
})
