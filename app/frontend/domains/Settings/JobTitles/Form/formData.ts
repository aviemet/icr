export type Permissions = {
	index?: boolean
	show?: boolean
	create?: boolean
	update?: boolean
	delete?: boolean
}

export type JobTitleFormData = {
	job_title: Schema.JobTitlesFormData
	permissions: {
		admin: boolean
		employee: Permissions
		client: Permissions
		doctor: Permissions
		vendor: Permissions
		payroll: {}
	}
}

export const emptyPermissions: {
	permissions: JobTitleFormData["permissions"]
} = {
	permissions: {
		admin: false,
		employee: { index: true, show: true, create: false, update: false, delete: false },
		client: { index: true, show: true, create: false, update: false, delete: false },
		doctor: { index: true, show: true, create: false, update: false, delete: false },
		vendor: { index: true, show: true, create: false, update: false, delete: false },
		payroll: {},
	},
}

export const emptyJobTitle: JobTitleFormData = {
	job_title: {
		name: "",
		description: "",
	},
	...emptyPermissions,
}

type TableRow = {
	model: string
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
] as const
