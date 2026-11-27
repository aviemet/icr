import { router, usePage } from "@inertiajs/react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Box, Button, Group, Table } from "@/components"

import { EmployeesTable } from "./EmployeesTable"
import {
	filterEmployeesForTab,
	parsePayrollIndexTab,
	type PayrollIndexTab,
} from "./payrollFilters"
import { PayrollTableFooter } from "./PayrollTableFooter"

interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
}

interface EmployeeExceptionsMap {
	exception_count?: number
}

interface UnreviewedShiftRow {
	id: string
	starts_at?: string
	client_names: string[]
}

interface WorkQueueProps {
	payPeriodId: string
	payPeriodSlug: string
	employees: Schema.EmployeesPersisted[]
	employeeHours: Record<string, EmployeeHoursMap>
	canApprove: boolean
	timesheetIdsByEmployee: Record<string, string>
	approvedAtByEmployee: Record<string, string>
	employeeExceptions: Record<string, EmployeeExceptionsMap>
	facilitatorShiftCountByEmployee?: Record<string, number>
	facilitatorReviewedShiftCountByEmployee?: Record<string, number>
	unreviewedShiftsByTimesheet?: Record<string, UnreviewedShiftRow[]>
	pagination: Schema.Pagination
	pendingCount: number
	flaggedCount: number
	defaultTab?: PayrollIndexTab
}

export function WorkQueue({
	payPeriodId,
	payPeriodSlug,
	employees,
	employeeHours,
	canApprove,
	timesheetIdsByEmployee,
	approvedAtByEmployee,
	employeeExceptions,
	facilitatorShiftCountByEmployee = {},
	facilitatorReviewedShiftCountByEmployee = {},
	unreviewedShiftsByTimesheet = {},
	pagination,
	pendingCount,
	flaggedCount,
	defaultTab = "needs_approval",
}: WorkQueueProps) {
	const { t } = useTranslation()
	const { url } = usePage()
	const activeTab = parsePayrollIndexTab(new URL(url, window.location.origin).searchParams.get("tab")) ?? defaultTab

	const selectTab = (tab: PayrollIndexTab) => {
		const nextUrl = new URL(url, window.location.origin)
		nextUrl.searchParams.set("tab", tab)
		router.get(nextUrl.pathname + nextUrl.search, {}, {
			preserveState: true,
			preserveScroll: true,
			replace: true,
		})
	}

	const filteredEmployees = useMemo(
		() => filterEmployeesForTab(employees, activeTab, approvedAtByEmployee, employeeExceptions),
		[employees, activeTab, approvedAtByEmployee, employeeExceptions],
	)

	const filteredHours = useMemo(() => {
		return filteredEmployees.reduce(
			(totals, employee) => {
				const hours = employeeHours[employee.id]
				return {
					regular: totals.regular + (hours?.regular_hours ?? 0),
					ot: totals.ot + (hours?.ot_hours ?? 0),
				}
			},
			{ regular: 0, ot: 0 },
		)
	}, [filteredEmployees, employeeHours])

	return (
		<Box>
			<Group gap={ 0 } mb="sm">
				<Button
					variant={ activeTab === "all" ? "light" : "subtle" }
					size="xs"
					onClick={ () => selectTab("all") }
				>
					{ t("views.timesheets.index.tabs.all") }
				</Button>
				<Button
					variant={ activeTab === "needs_approval" ? "light" : "subtle" }
					size="xs"
					onClick={ () => selectTab("needs_approval") }
				>
					{ t("views.timesheets.index.tabs.needs_approval") } ({ pendingCount })
				</Button>
				<Button
					variant={ activeTab === "flagged" ? "light" : "subtle" }
					size="xs"
					onClick={ () => selectTab("flagged") }
				>
					{ t("views.timesheets.index.tabs.flagged") } ({ flaggedCount })
				</Button>
				<Button
					variant={ activeTab === "approved" ? "light" : "subtle" }
					size="xs"
					onClick={ () => selectTab("approved") }
				>
					{ t("views.timesheets.index.tabs.approved") }
				</Button>
			</Group>

			<EmployeesTable
				payPeriodSlug={ payPeriodSlug }
				employees={ filteredEmployees }
				employee_hours={ employeeHours }
				canApprove={ canApprove }
				timesheetIdsByEmployee={ timesheetIdsByEmployee }
				approvedAtByEmployee={ approvedAtByEmployee }
				employeeExceptions={ employeeExceptions }
				facilitatorShiftCountByEmployee={ facilitatorShiftCountByEmployee }
				facilitatorReviewedShiftCountByEmployee={ facilitatorReviewedShiftCountByEmployee }
				unreviewedShiftsByTimesheet={ unreviewedShiftsByTimesheet }
			/>

			<Table.Pagination pagination={ pagination } model="employees" />

			<PayrollTableFooter
				payPeriodId={ payPeriodId }
				employeeCount={ filteredEmployees.length }
				totalRegularHours={ filteredHours.regular }
				totalOtHours={ filteredHours.ot }
				canApprove={ canApprove }
				timesheetIdsByEmployee={ timesheetIdsByEmployee }
			/>
		</Box>
	)
}
