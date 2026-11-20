import dayjs from "dayjs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
	isOffboardingDateToday,
	isOffboardingEffectiveFuture,
	resolveOffboardingEffectiveAt,
} from "@/domains/Employees/StatusChange/offboardingSchedule"

describe("offboardingSchedule", () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2026, 3, 13, 12, 0, 0))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("uses beginning of day when time is blank", () => {
		const effectiveAt = resolveOffboardingEffectiveAt("2026-04-16", "")
		expect(effectiveAt).not.toBeNull()
		expect(dayjs(effectiveAt).format("YYYY-MM-DD HH:mm")).toBe("2026-04-16 00:00")
	})

	it("combines date and time", () => {
		const effectiveAt = resolveOffboardingEffectiveAt("2026-04-16", "15:30")
		expect(dayjs(effectiveAt).format("YYYY-MM-DD HH:mm")).toBe("2026-04-16 15:30")
	})

	it("detects today and future effective times", () => {
		expect(isOffboardingDateToday("2026-04-13")).toBe(true)
		expect(isOffboardingDateToday("2026-04-14")).toBe(false)
		expect(isOffboardingEffectiveFuture("2026-04-13", "")).toBe(false)
		expect(isOffboardingEffectiveFuture("2026-04-14", "")).toBe(true)
		expect(isOffboardingEffectiveFuture("2026-04-12", "")).toBe(false)
	})
})
