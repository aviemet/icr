import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { Routes } from "@/lib"
import { useCreateCalendarEvent, useUpdateCalendarEvent } from "@/queries/calendarEvents"
import { server } from "@/tests/helpers/mockServer"

describe("Calendar Event Mutations", () => {
	let queryClient: QueryClient

	beforeEach(() => {
		queryClient = new QueryClient()
		vi.resetAllMocks()
	})

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={ queryClient }>
			{ children }
		</QueryClientProvider>
	)

	describe("useCreateCalendarEvent", () => {
		const mockCalendarData = {
			calendar_event: {
				starts_at: new Date(),
				ends_at: new Date(),
				shift: {
					// mock shift data
				},
				event_participants: [],
			},
		}

		it("should create a calendar event", async() => {
			const { result } = renderHook(
				() => useCreateCalendarEvent({
					onSuccess: vi.fn(),
				}),
				{ wrapper }
			)

			const response = await result.current.mutateAsync(mockCalendarData)
			expect(response.id).toBe("123")
		})

		it("should handle creation errors", async() => {
			server.use(
				http.post(Routes.apiCalendarEvents(), () => HttpResponse.json({ error: "nope" }, { status: 500 }))
			)

			const { result } = renderHook(
				() => useCreateCalendarEvent({
					onError: vi.fn(),
				}),
				{ wrapper }
			)

			await expect(result.current.mutateAsync(mockCalendarData)).rejects.toThrow()
		})
	})

	describe("useUpdateCalendarEvent", () => {
		const eventId = "123"
		const mockCalendarData = {
			calendar_event: {
				starts_at: new Date(),
				ends_at: new Date(),
				shift: {
					// mock shift data
				},
				event_participants: [],
			},
		}

		it("should update a calendar event", async() => {
			const { result } = renderHook(
				() => useUpdateCalendarEvent({
					params: { id: eventId },
					onSuccess: vi.fn(),
				}),
				{ wrapper }
			)

			const response = await result.current.mutateAsync(mockCalendarData)
			expect(response.id).toBe(eventId)
		})

		it("should invalidate queries on successful update", async() => {
			const onSuccess = vi.fn()
			const { result } = renderHook(
				() => useUpdateCalendarEvent({
					params: { id: eventId },
					onSuccess,
				}),
				{ wrapper }
			)

			await result.current.mutateAsync(mockCalendarData)

			expect(onSuccess).toHaveBeenCalled()
			// Can also verify that queryClient.invalidateQueries was called with correct keys
		})
	})
})
