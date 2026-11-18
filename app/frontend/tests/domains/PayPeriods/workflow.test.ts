import { describe, expect, it } from "vitest"

import { periodWorkflowLabel } from "@/domains/PayPeriods/workflow"

describe("periodWorkflowLabel", () => {
	const translate = (key: string) => key

	it("maps each workflow status to its locale key", () => {
		expect(periodWorkflowLabel("open", translate)).toBe("views.pay_periods.index.workflow.open")
		expect(periodWorkflowLabel("current", translate)).toBe("views.pay_periods.index.workflow.current")
		expect(periodWorkflowLabel("pending", translate)).toBe("views.pay_periods.index.workflow.pending")
		expect(periodWorkflowLabel("approved", translate)).toBe("views.pay_periods.index.workflow.approved")
		expect(periodWorkflowLabel("closed", translate)).toBe("views.pay_periods.index.workflow.closed")
	})

	it("falls back to open for unknown statuses", () => {
		expect(periodWorkflowLabel("unknown", translate)).toBe("views.pay_periods.index.workflow.open")
	})
})
