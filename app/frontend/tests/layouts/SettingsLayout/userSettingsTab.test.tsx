import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { theme } from "@/lib/theme"

const mockPathname = vi.fn(() => "/settings/user")

vi.mock("@/lib/hooks", () => ({
	useLocation: () => ({
		pathname: mockPathname(),
		paths: ["settings", "user"],
	}),
	useFeatures: () => ({
		enabled: () => false,
		features: { compliance_forms: false },
	}),
}))

vi.mock("@/layouts/AppLayout", () => ({
	AppLayout: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>,
}))

describe("SettingsLayout user settings tab", () => {
	beforeEach(() => {
		cleanup()
		mockPathname.mockReturnValue("/settings/user")
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

	it("marks the User Settings link active", async () => {
		const { SettingsLayout } = await import("@/layouts/SettingsLayout")

		render(
			<MantineProvider theme={ theme } defaultColorScheme="light">
				<SettingsLayout>
					<div>content</div>
				</SettingsLayout>
			</MantineProvider>,
		)

		const userSettingsLink = screen.getByRole("link", { name: "User Settings" })
		expect(userSettingsLink).toHaveAttribute("href", "/settings/user")
		expect(userSettingsLink).toHaveAttribute("data-active", "true")
		expect(screen.getByRole("link", { name: "General" })).not.toHaveAttribute("data-active", "true")
	})
})
