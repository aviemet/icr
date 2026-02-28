import { Grid, MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import dayjs from "dayjs"
import { describe, it, expect, beforeEach } from "vitest"
import { Form, useForm } from "use-inertia-form"

import { parseTimeString } from "@/components/Form/Inputs/SplitDateTimeInput"
import { EventTotalHours } from "@/features/Clients/schedule/NewEventForm/EventTotalHours"
import { type NewEventData } from "@/features/Clients/schedule/NewEventForm"

function TestWrapper({ children }: { children: React.ReactNode }) {
	return <MantineProvider>{children}</MantineProvider>
}

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

function UpdateTimesButton() {
	const form = useForm<NewEventData>()
	const base = dayjs().startOf("day")
	return (
		<button
			type="button"
			onClick={() => {
				form.setData("calendar_event.starts_at", base.hour(10).minute(0).toDate())
				form.setData("calendar_event.ends_at", base.hour(19).minute(0).toDate())
			}}
		>
			Set 10–19
		</button>
	)
}

function TestForm({ initialData }: { initialData: NewEventData }) {
	return (
		<Form<NewEventData>
			data={initialData}
			model="calendar_event"
			to="#"
		>
			<Grid>
				<EventTotalHours />
				<UpdateTimesButton />
			</Grid>
		</Form>
	)
}

describe("parseTimeString (SplitDateTimeInput)", () => {
	it("parses 24h time strings", () => {
		expect(parseTimeString("14:30")).toEqual({ hour: 14, minute: 30 })
		expect(parseTimeString("9:00")).toEqual({ hour: 9, minute: 0 })
		expect(parseTimeString("00:00")).toEqual({ hour: 0, minute: 0 })
		expect(parseTimeString("23:59")).toEqual({ hour: 23, minute: 59 })
	})
	it("parses 12h time strings with AM/PM", () => {
		expect(parseTimeString("2:30 PM")).toEqual({ hour: 14, minute: 30 })
		expect(parseTimeString("9:00 AM")).toEqual({ hour: 9, minute: 0 })
		expect(parseTimeString("12:00 PM")).toEqual({ hour: 12, minute: 0 })
		expect(parseTimeString("12:00 AM")).toEqual({ hour: 0, minute: 0 })
	})
	it("returns null for invalid or empty strings", () => {
		expect(parseTimeString("")).toBeNull()
		expect(parseTimeString("   ")).toBeNull()
		expect(parseTimeString("not-a-time")).toBeNull()
	})
})

describe("EventTotalHours", () => {
	it("shows duration from initial form data", () => {
		const base = dayjs().startOf("day")
		const initialData: NewEventData = {
			calendar_event: {
				starts_at: base.hour(9).minute(0).toDate(),
				ends_at: base.hour(17).minute(0).toDate(),
				shift: { employee_id: "" },
				event_participants: [],
			},
		}
		render(<TestForm initialData={initialData} />, { wrapper: TestWrapper })
		expect(screen.getByText(/Duration: 8 hours/)).toBeInTheDocument()
	})

	it("updates duration when form data calendar_event.starts_at and ends_at change", async () => {
		const base = dayjs().startOf("day")
		const initialData: NewEventData = {
			calendar_event: {
				starts_at: base.hour(9).minute(0).toDate(),
				ends_at: base.hour(17).minute(0).toDate(),
				shift: { employee_id: "" },
				event_participants: [],
			},
		}
		render(<TestForm initialData={initialData} />, { wrapper: TestWrapper })
		expect(screen.getByText(/Duration: 8 hours/)).toBeInTheDocument()
		await userEvent.click(screen.getByRole("button", { name: /Set 10–19/ }))
		expect(screen.getByText(/Duration: 9 hours/)).toBeInTheDocument()
	})
})
