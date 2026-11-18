export type Permissions = {
	index?: boolean
	show?: boolean
	create?: boolean
	update?: boolean
	delete?: boolean
}

export type JobTitleFormData = {
	job_title: Schema.EmployeeJobTitlesFormData
	permissions: {
		admin: boolean
		employee: Permissions
		client: Permissions
		doctor: Permissions
		vendor: Permissions
		timesheet: Permissions
		calendar_event: Permissions
		setting: Permissions
		incident_report: Permissions
	}
}

const emptyResourcePermissions: Permissions = {
	index: false,
	show: false,
	create: false,
	update: false,
	delete: false,
}

export const emptyPermissions: {
	permissions: JobTitleFormData["permissions"]
} = {
	permissions: {
		admin: false,
		employee: { ...emptyResourcePermissions },
		client: { ...emptyResourcePermissions },
		doctor: { ...emptyResourcePermissions },
		vendor: { ...emptyResourcePermissions },
		timesheet: { ...emptyResourcePermissions },
		calendar_event: { ...emptyResourcePermissions },
		setting: { ...emptyResourcePermissions },
		incident_report: { ...emptyResourcePermissions },
	},
}

export const emptyJobTitle: JobTitleFormData = {
	job_title: {
		name: "",
		description: "",
		department_id: null,
		department: {
			name: "",
			description: "",
		},
	},
	...emptyPermissions,
}

type TableRow = {
	model: keyof Omit<JobTitleFormData["permissions"], "admin">
	label: string
	permissions: (keyof Permissions)[]
}

export const tableRows: TableRow[] = [
	{
		model: "employee",
		label: "Employees",
		permissions: ["index", "show", "create", "update", "delete"],
	},
	{
		model: "client",
		label: "Clients",
		permissions: ["index", "show", "create", "update", "delete"],
	},
	{
		model: "doctor",
		label: "Doctors",
		permissions: ["index", "show", "create", "update", "delete"],
	},
	{
		model: "vendor",
		label: "Vendors",
		permissions: ["index", "show", "create", "update", "delete"],
	},
	{
		model: "timesheet",
		label: "Payroll / Timesheets",
		permissions: ["index", "show", "create", "update", "delete"],
	},
	{
		model: "calendar_event",
		label: "Calendar",
		permissions: ["index", "show", "create", "update", "delete"],
	},
	{
		model: "setting",
		label: "Settings",
		permissions: ["index", "show", "create", "update", "delete"],
	},
	{
		model: "incident_report",
		label: "Incident Reports",
		permissions: ["index", "show", "create", "update", "delete"],
	},
]
