import { http, HttpResponse } from "msw"

import { Routes } from "@/lib"

export const handlers = [
	http.get(Routes.apiCalendarEvents(), () => {
		return HttpResponse.json([])
	}),
]
