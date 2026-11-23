import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ServiceTypes } from "@/domains/Settings/Calendar/ServiceTypes"
import { theme } from "@/lib/theme"

vi.mock("@inertiajs/react", () => ({
	router: {
		reload: vi.fn(),
		post: vi.fn(),
		delete: vi.fn(),
		patch: vi.fn(),
		get: vi.fn(),
	},
}))

vi.mock("@/lib/hooks/useLocation", () => ({
	useLocation: () => ({
		pathname: "/settings/calendar/service_types",
		path: "/settings/calendar/service_types",
		params: new URLSearchParams(),
		paramsAsJson: {},
	}),
}))

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

const serviceTypes: Schema.ServiceType[] = [
	{
		id: "1",
		name: "Regular",
		slug: "regular",
		active: true,
		system: true,
		position: 0,
		billable: true,
		payable: true,
		allows_multi_client: false,
		requires_notes: false,
		tracks_mileage: false,
		color: "#2F6FED",
	},
	{
		id: "2",
		name: "Community Outing",
		slug: "community-outing",
		active: true,
		system: false,
		position: 1,
		billable: true,
		payable: true,
		allows_multi_client: true,
		requires_notes: false,
		tracks_mileage: true,
		color: "#0B7A75",
	},
]

function renderServiceTypes(records: Schema.ServiceType[] = serviceTypes) {
	return render(
		<MantineProvider theme={ theme } defaultColorScheme="dark">
			<ModalsProvider>
				<ServiceTypes service_types={ records } />
			</ModalsProvider>
		</MantineProvider>,
	)
}

describe("ServiceTypes", () => {
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

	it("renders the table with an add trigger and row records", () => {
		const { container } = renderServiceTypes()
		expect(screen.getByText("views.settings.calendar.service_types_existing_title")).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "views.settings.calendar.service_types_add" })).toBeInTheDocument()
		expect(container.querySelector(".mantine-datatable")).toBeInTheDocument()
		expect(container.querySelectorAll(".mantine-datatable-row")).toHaveLength(2)
	})
})
