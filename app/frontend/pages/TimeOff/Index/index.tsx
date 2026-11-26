import { TimeOffBoard } from "@/domains/TimeOff/TimeOffBoard"
import { withLayout } from "@/lib"

export interface TimeOffIndexProps {
	my_requests: Schema.TimeOffRequestsIndex[]
	pending_queue: Schema.TimeOffRequestsIndex[]
	org_pending: Schema.TimeOffRequestsIndex[]
	managed_employees: Schema.EmployeesPersisted[]
	current_employee_id?: string
	can_approve: boolean
	can_create: boolean
	can_manager_leave: boolean
}

const TimeOffIndex = ({
	my_requests,
	pending_queue,
	org_pending,
	managed_employees,
	current_employee_id,
	can_approve,
	can_create,
	can_manager_leave,
}: TimeOffIndexProps) => {
	return (
		<TimeOffBoard
			myRequests={ my_requests }
			pendingQueue={ pending_queue }
			orgPending={ org_pending }
			managedEmployees={ managed_employees }
			currentEmployeeId={ current_employee_id }
			canApprove={ can_approve }
			canCreate={ can_create }
			canManagerLeave={ can_manager_leave }
		/>
	)
}

export default withLayout(TimeOffIndex, "app")
