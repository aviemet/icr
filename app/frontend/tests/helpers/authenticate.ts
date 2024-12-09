import { beforeAll } from 'vitest'
import axios from 'axios'

beforeAll(async () => {
	await axios.post('http://localhost:3000/test/login', {
		email: 'aviemet@gmail.com',
		password: 'Complex1!',
	}, {
		withCredentials: true,
	})
})

export const axiosInstance = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: true,
	// headers: {
	// 	Cookie: Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; '),
	// },
})
