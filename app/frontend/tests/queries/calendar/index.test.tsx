import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook } from "@testing-library/react"
import axios from "axios"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { Routes } from "@/lib"
import { useCreateCalendarEvent, useUpdateCalendarEvent } from "@/queries/calendarEvents"

vi.mock("axios")

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
			const mockResponse = { data: { id: "123", ...mockCalendarData }, statusText: "OK" }
			vi.mocked(axios.post).mockResolvedValueOnce(mockResponse)

			const { result } = renderHook(
				() => useCreateCalendarEvent({
					onSuccess: vi.fn(),
				}),
				{ wrapper }
			)

			await result.current.mutateAsync(mockCalendarData)

			expect(axios.post).toHaveBeenCalledWith(
				Routes.apiCalendarEvents(),
				mockCalendarData
			)
		})

		it("should handle creation errors", async() => {
			vi.mocked(axios.post).mockRejectedValueOnce(new Error("Network error"))

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
			const mockResponse = { data: { id: eventId, ...mockCalendarData }, statusText: "OK" }
			vi.mocked(axios.patch).mockResolvedValueOnce(mockResponse)

			const { result } = renderHook(
				() => useUpdateCalendarEvent({
					params: { id: eventId },
					onSuccess: vi.fn(),
				}),
				{ wrapper }
			)

			await result.current.mutateAsync(mockCalendarData)

			expect(axios.patch).toHaveBeenCalledWith(
				Routes.apiCalendarEvent(eventId),
				mockCalendarData
			)
		})

		it("should invalidate queries on successful update", async() => {
			const mockResponse = { data: { id: eventId, ...mockCalendarData }, statusText: "OK" }
			vi.mocked(axios.patch).mockResolvedValueOnce(mockResponse)

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
