import { MantineProvider } from "@mantine/core"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TrainingAvailabilityButton } from "@/domains/Trainings/AvailabilityButton"
import { theme } from "@/lib/theme"

const { put } = vi.hoisted(() => ({
	put: vi.fn(),
}))

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

vi.mock("@inertiajs/react", () => ({
	router: {
		put,
	},
}))

vi.mock("@/lib", () => ({
	Routes: {
		statusTraining: (id: string) => `/employees/trainings/${id}/status`,
	},
}))

describe("TrainingAvailabilityButton", () => {
	beforeEach(() => {
		cleanup()
		put.mockReset()
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: () => ({
				matches: false,
				addListener: () => undefined,
				removeListener: () => undefined,
				addEventListener: () => undefined,
				removeEventListener: () => undefined,
				dispatchEvent: () => false,
			}),
		})
	})

	it("retires an active training", () => {
		render(
			<MantineProvider theme={ theme }>
				<TrainingAvailabilityButton training={ { id: "training-1", status: "active" } } />
			</MantineProvider>,
		)

		fireEvent.click(screen.getByText("views.trainings.actions.retire"))
		expect(put).toHaveBeenCalledWith(
			"/employees/trainings/training-1/status",
			{},
			{ preserveScroll: true },
		)
	})

	it("offers an inactive training again", () => {
		render(
			<MantineProvider theme={ theme }>
				<TrainingAvailabilityButton training={ { id: "training-1", status: "inactive" } } />
			</MantineProvider>,
		)

		expect(screen.getByText("views.trainings.actions.offer_again")).toBeTruthy()
	})
})
