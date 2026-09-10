import axios, { create } from "axios"
import { beforeAll } from "vitest"

beforeAll(async () => {
	await axios.post("http://localhost:3000/test/login", {
		email: "aviemet@gmail.com",
		password: "Complex1!",
	}, {
		withCredentials: true,
	})
})

export const axiosInstance = create({
	baseURL: "http://localhost:3000",
	withCredentials: true,
})
