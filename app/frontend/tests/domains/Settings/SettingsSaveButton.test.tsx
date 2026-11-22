import { MantineProvider } from "@mantine/core"
import { act, cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { SettingsSaveButton } from "@/domains/Settings/SettingsSaveButton"
import { theme } from "@/lib/theme"

const useSlotProps = vi.hoisted(() => vi.fn())
const getFormData = vi.hoisted(() => vi.fn(() => ({ settings: { weekly: "40" } })))
const subscribeFormData = vi.hoisted(() => vi.fn(() => () => {}))
const translate = vi.hoisted(() => vi.fn((key: string) => {
	if(key === "views.settings.save") return "Update settings"
	if(key === "views.settings.saving") return "Saving..."
	return key
}))

vi.mock("@/components/Form", async () => {
	const actual = await vi.importActual<typeof import("@/components/Form")>("@/components/Form")
	return {
		...actual,
		useSlotProps: () => useSlotProps(),
		useFormFieldContext: () => ({
			getFormData,
			subscribeFormData,
		}),
	}
})

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: translate }),
}))

describe("SettingsSaveButton", () => {
	beforeEach(() => {
		cleanup()
		useSlotProps.mockReset()
		getFormData.mockReset()
		subscribeFormData.mockReset()
		translate.mockClear()
		getFormData.mockReturnValue({ settings: { weekly: "40" } })
		subscribeFormData.mockReturnValue(() => {})
		useSlotProps.mockReturnValue({ processing: false })
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

	it("is disabled until the form data changes", async () => {
		render(
			<MantineProvider theme={ theme }>
				<form>
					<SettingsSaveButton />
				</form>
			</MantineProvider>,
		)

		await act(async () => {
			await new Promise<void>(resolve => {
				requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
			})
		})

		expect(screen.getByRole("button", { name: "Update settings" })).toBeDisabled()

		getFormData.mockReturnValue({ settings: { weekly: "45" } })
		const form = screen.getByRole("button", { name: "Update settings" }).closest("form")
		expect(form).toBeTruthy()
		await act(async () => {
			form?.dispatchEvent(new Event("input", { bubbles: true }))
		})

		expect(screen.getByRole("button", { name: "Update settings" })).toBeEnabled()
	})

	it("shows saving state while processing", async () => {
		useSlotProps.mockReturnValue({ processing: true })

		render(
			<MantineProvider theme={ theme }>
				<form>
					<SettingsSaveButton />
				</form>
			</MantineProvider>,
		)

		await act(async () => {
			await new Promise<void>(resolve => {
				requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
			})
		})

		expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled()
	})
})
