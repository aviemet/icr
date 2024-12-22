import { Routes } from '@/lib'
import { http, HttpResponse } from 'msw'

export const handlers = [
	http.get(Routes.apiSearches(), () => {
		return HttpResponse.json([
			{
				id: 26,
				label: 'iPhone 4',
				content: 'iPhone 4 4WE3GN55 4WE3GN55',
				searchable_type: 'Asset',
				searchable_id: 1,
				created_at: '2024-05-21T13:16:56.311-07:00',
				updated_at: '2024-05-21T13:16:56.311-07:00',
			},
			{
				id: 27,
				label: 'iPhone 6S / 6S Plus',
				content: 'iPhone 6S / 6S Plus 6FL77GXM 6FL77GXM',
				searchable_type: 'Asset',
				searchable_id: 2,
				created_at: '2024-05-21T13:16:56.323-07:00',
				updated_at: '2024-05-21T13:16:56.323-07:00',
			},
		])
	}),
]
