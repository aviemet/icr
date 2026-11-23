import { router } from "@inertiajs/react"

import { Button, Group, Link, Stack, Table, Text, type TableColumn } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { Routes } from "@/lib"

import { type ComplianceQueueCounts, type ComplianceQueueTab } from "./types"

interface WorkQueueProps {
	formSubmissions: Schema.ComplianceFormSubmissionsIndex[]
	tab: ComplianceQueueTab
	counts: ComplianceQueueCounts
}

const TABS: { id: ComplianceQueueTab, label: string }[] = [
	{ id: "due", label: "Due" },
	{ id: "overdue", label: "Overdue" },
	{ id: "open_actions", label: "Open actions" },
	{ id: "submitted", label: "Submitted" },
	{ id: "all", label: "All" },
]

export function WorkQueue({ formSubmissions, tab, counts }: WorkQueueProps) {
	const setTab = (nextTab: ComplianceQueueTab) => {
		router.get(Routes.complianceFormSubmissions({ tab: nextTab }), {}, {
			preserveState: true,
			preserveScroll: true,
		})
	}

	const columns: TableColumn<Schema.ComplianceFormSubmissionsIndex>[] = [
		{
			accessor: "subject_label",
			title: "Subject",
			render: (submission) => (
				<Link href={ Routes.complianceFormSubmission(submission.id) }>
					{ submission.subject_label }
				</Link>
			),
		},
		{
			accessor: "form_template",
			title: "Form",
			render: (submission) => submission.form_template.name,
		},
		{
			accessor: "due_on",
			title: "Due",
			render: (submission) => (
				submission.due_on
					? <DateTimeFormatter>{ submission.due_on }</DateTimeFormatter>
					: "-"
			),
		},
		{
			accessor: "status",
			title: "Status",
		},
		{
			accessor: "overdue",
			title: "Overdue",
			render: (submission) => (submission.overdue ? "Yes" : "-"),
		},
		{
			accessor: "open_corrective_actions_count",
			title: "Open actions",
		},
		{
			accessor: "id",
			title: "",
			render: (submission) => (
				submission.status === "draft"
					? (
						<Link as="button" href={ Routes.editComplianceFormSubmission(submission.id) } buttonProps={ { size: "xs", variant: "light" } }>
							Continue
						</Link>
					)
					: (
						<Link as="button" href={ Routes.complianceFormSubmission(submission.id) } buttonProps={ { size: "xs", variant: "subtle" } }>
							View
						</Link>
					)
			),
		},
	]

	return (
		<Stack gap="md">
			<Group gap="xs">
				{ TABS.map(entry => (
					<Button
						key={ entry.id }
						variant={ tab === entry.id ? "filled" : "light" }
						size="xs"
						onClick={ () => setTab(entry.id) }
					>
						{ `${entry.label} (${counts[entry.id]})` }
					</Button>
				)) }
			</Group>
			{ formSubmissions.length === 0
				? <Text>{ "No inspections in this queue." }</Text>
				: (
					<Table>
						<Table.DataTable
							records={ formSubmissions }
							columns={ columns }
						/>
					</Table>
				) }
		</Stack>
	)
}
