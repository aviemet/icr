export function periodWorkflowLabel(status: string, translate: (key: string) => string) {
	switch(status) {
		case "open":
			return translate("views.pay_periods.index.workflow.open")
		case "current":
			return translate("views.pay_periods.index.workflow.current")
		case "pending":
			return translate("views.pay_periods.index.workflow.pending")
		case "approved":
			return translate("views.pay_periods.index.workflow.approved")
		case "closed":
			return translate("views.pay_periods.index.workflow.closed")
		default:
			return translate("views.pay_periods.index.workflow.open")
	}
}
