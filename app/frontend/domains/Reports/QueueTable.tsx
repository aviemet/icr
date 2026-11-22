import { Anchor, Stack, Table, Text, type TableColumn } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"

export interface ReportRequestListItem {
	id: string
	name: string
	status: string
	requested_by_name?: string | null
	created_at: string
	completed_at?: string | null
	download_path?: string | null
	error_message?: string | null
}

interface QueueTableProps {
	reportRequests: ReportRequestListItem[]
}

export function QueueTable({ reportRequests }: QueueTableProps) {
	if(reportRequests.length === 0) {
		return <Text>{ "No report requests yet" }</Text>
	}

	const columns: TableColumn<ReportRequestListItem>[] = [
		{
			accessor: "name",
			title: "Report",
			render: (request) => (
				<Stack gap={ 2 }>
					<Text>{ request.name }</Text>
					{ request.error_message && (
						<Text size="sm" c="red">{ request.error_message }</Text>
					) }
				</Stack>
			),
		},
		{
			accessor: "status",
			title: "Status",
		},
		{
			accessor: "requested_by_name",
			title: "Requested by",
			render: (request) => request.requested_by_name ?? "-",
		},
		{
			accessor: "created_at",
			title: "Requested",
			render: (request) => <DateTimeFormatter>{ request.created_at }</DateTimeFormatter>,
		},
		{
			accessor: "completed_at",
			title: "Completed",
			render: (request) => (
				request.completed_at
					? <DateTimeFormatter>{ request.completed_at }</DateTimeFormatter>
					: "-"
			),
		},
		{
			accessor: "download_path",
			title: "Download",
			render: (request) => (
				request.download_path
					? <Anchor href={ request.download_path }>{ "Download" }</Anchor>
					: "-"
			),
		},
	]

	return (
		<Table>
			<Table.DataTable
				records={ reportRequests }
				columns={ columns }
			/>
		</Table>
	)
}
