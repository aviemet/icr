import { describe, expect, it } from "vitest"

import { payrollDueDateLabel } from "@/domains/PayPeriods/dueDateLabel"

describe("payrollDueDateLabel", () => {
	const keys = {
		dueInDays: "due",
		overdueByDays: "overdue",
	}

	const translate = (key: string, options: { count: number }) => `${key}:${options.count}`

	it("uses due-in copy when the deadline is today or later", () => {
		expect(payrollDueDateLabel(0, translate, keys)).toBe("due:0")
		expect(payrollDueDateLabel(3, translate, keys)).toBe("due:3")
	})

	it("uses overdue copy with absolute days when past the deadline", () => {
		expect(payrollDueDateLabel(-1, translate, keys)).toBe("overdue:1")
		expect(payrollDueDateLabel(-5, translate, keys)).toBe("overdue:5")
	})
})
