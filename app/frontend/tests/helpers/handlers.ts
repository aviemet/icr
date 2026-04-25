import { http, HttpResponse } from "msw"

import { Routes } from "@/lib"

export const handlers = [
	http.get(Routes.apiCalendarEvents(), () => {
		return HttpResponse.json([])
	}),
	http.post(Routes.apiCalendarEvents(), async({ request }) => {
		const body = await request.json().catch(() => ({}))
		return HttpResponse.json({ id: "123", ...(typeof body === "object" && body ? body : {}) }, { status: 201 })
	}),
	http.patch(Routes.apiCalendarEvent("123"), async({ request }) => {
		const body = await request.json().catch(() => ({}))
		return HttpResponse.json({ id: "123", ...(typeof body === "object" && body ? body : {}) }, { status: 200 })
	}),
]
