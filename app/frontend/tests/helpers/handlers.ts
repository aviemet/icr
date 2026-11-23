import { http, HttpResponse } from "msw"

import { Routes } from "@/lib"

export const handlers = [
	http.get(Routes.apiCalendarEvents(), () => {
		return HttpResponse.json([])
	}),
	http.post(Routes.apiCalendarEvents(), async ({ request }) => {
		const body = await request.json().catch(() => ({}))
		return HttpResponse.json({ id: "123", ...(typeof body === "object" && body ? body : {}) }, { status: 201 })
	}),
	http.patch(Routes.apiCalendarEvent("123"), async ({ request }) => {
		const body = await request.json().catch(() => ({}))
		return HttpResponse.json({ id: "123", ...(typeof body === "object" && body ? body : {}) }, { status: 200 })
	}),
	http.get(Routes.apiEmployeesOptions(), () => {
		return HttpResponse.json([])
	}),
	http.get(/\/api\/options\/categories\/.+/, () => {
		return HttpResponse.json([])
	}),
	http.get(Routes.apiServiceTypesOptions(), () => {
		return HttpResponse.json([
			{
				id: "st-1",
				name: "Regular",
				slug: "regular",
				active: true,
				color: "#15803D",
				billable: true,
				payable: true,
				allows_multi_client: false,
				requires_notes: false,
				tracks_mileage: false,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		])
	}),
]
