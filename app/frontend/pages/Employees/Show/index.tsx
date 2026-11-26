import { useTranslation } from "react-i18next"

import { Avatar, Badge, Link, Presence, ScheduleButton, Text } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { employeeStatusBadgeColor } from "@/domains/Employees/employeeStatusBadgeColor"
import { type RequirementFulfillmentsPayload } from "@/domains/Employees/Requirements/types"
import { RecordShowShell } from "@/features"
import { initials, Routes } from "@/lib"

import Assignments from "./Assignments"
import Contacts from "./Contacts"
import Credentials from "./Credentials"
import Documents from "./Documents"
import Hiring from "./Hiring"
import Overview from "./Overview"
import Pay from "./Pay"
import Profile from "./Profile"
import Requirements from "./Requirements"
import Trainings from "./Trainings"

export interface ShowEmployeeProps {
	employee: Schema.EmployeesShow
	can_update?: boolean
	can_complete_trainings?: boolean
	trainingOptions?: Schema.EmployeeTrainingsOptions[]
	requirement_fulfillments?: RequirementFulfillmentsPayload
}

const emptyFulfillments: RequirementFulfillmentsPayload = {
	requirements: [],
	met_count: 0,
	unmet_count: 0,
	total_count: 0,
}

const ShowEmployee = ({
	employee,
	can_update = false,
	can_complete_trainings = false,
	trainingOptions = [],
	requirement_fulfillments = emptyFulfillments,
}: ShowEmployeeProps) => {
	const { t } = useTranslation()
	const title = employee?.person?.name || t("views.employees.show.title")
	const employeeStatus = employee?.status
	const statusLabel = employeeStatus
		? t(`views.employees.table.statuses.${employeeStatus}`, { defaultValue: employeeStatus })
		: ""
	const statusColor = employeeStatus ? employeeStatusBadgeColor(employeeStatus) : "blue"

	return (
		<RecordShowShell
			title={ title }
			breadcrumbs={ [
				{ title: t("views.employees.index.title"), href: Routes.employees() },
				{ title, href: Routes.employee(employee.slug) },
			] }
			avatar={ (
				<Avatar radius="xl" size={ 44 } color={ employee.color || "brand" }>
					{ initials(title) ?? "?" }
				</Avatar>
			) }
			badge={ employeeStatus
				? <Badge color={ statusColor } variant="light">{ statusLabel }</Badge>
				: undefined }
			meta={ (
				<>
					<Text size="sm" c="dimmed" component="span">
						{ t("views.employees.show.overview.employee_number") }: <Presence>{ employee.number }</Presence>
					</Text>
					{ employee.job_title && (
						<Text size="sm" c="dimmed" component="span">
							{ t("views.employees.show.overview.job_title") }: { String(employee.job_title.name) }
						</Text>
					) }
					{ employee.active_at && employeeStatus !== "applicant" && employeeStatus !== "offered" && (
						<Text size="sm" c="dimmed" component="span">
							{ t("views.employees.show.overview.hire_date") }:{ " " }
							<DateTimeFormatter>{ employee.active_at }</DateTimeFormatter>
						</Text>
					) }
				</>
			) }
			actions={ (
				<>
					{ employeeStatus !== "applicant" && employeeStatus !== "offered" && (
						<ScheduleButton href={ Routes.scheduleEmployee(employee.slug) } appearance="button" />
					) }
					{ can_update && (
						<Link href={ Routes.statusEmployee(employee.slug) } as="button" buttonProps={ { variant: "light", size: "sm" } }>
							{ t("views.employees.show.change_status") }
						</Link>
					) }
				</>
			) }
			tabs={ [
				{
					id: "overview",
					label: t("views.employees.show.tabs.overview"),
					panel: (
						<Overview
							employee={ employee }
							requirement_fulfillments={ requirement_fulfillments }
						/>
					),
				},
				{ id: "profile", label: t("views.employees.show.tabs.profile"), panel: <Profile employee={ employee } /> },
				{ id: "contacts", label: t("views.employees.show.tabs.contacts"), panel: <Contacts employee={ employee } /> },
				{ id: "credentials", label: t("views.employees.show.tabs.credentials"), panel: <Credentials employee={ employee } /> },
				{ id: "assignments", label: t("views.employees.show.tabs.assignments"), panel: <Assignments employee={ employee } /> },
				{
					id: "trainings",
					label: t("views.employees.show.tabs.trainings"),
					panel: (
						<Trainings
							employee={ employee }
							trainingOptions={ trainingOptions }
							can_complete_trainings={ can_complete_trainings }
						/>
					),
				},
				{
					id: "requirements",
					label: t("views.employees.show.tabs.requirements"),
					panel: <Requirements fulfillments={ requirement_fulfillments } />,
				},
				{ id: "hiring", label: t("views.employees.show.tabs.hiring"), panel: <Hiring employee={ employee } /> },
				{ id: "pay", label: t("views.employees.show.tabs.pay"), panel: <Pay employee={ employee } /> },
				{ id: "documents", label: t("views.employees.show.tabs.documents"), panel: <Documents employee={ employee } /> },
			] }
		/>
	)
}

export default ShowEmployee
