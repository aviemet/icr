import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import {
	Badge,
	Box,
	Group,
	Modal,
	Text,
	type TableColumn,
	Table, DataTable,
} from "@/components"
import { DeleteButton, EditButton } from "@/components/Button"
import { Routes } from "@/lib"

import { ServiceTypeFormModalBody } from "./ServiceTypeFormModalBody"
import * as classes from "./ServiceTypes.css"

interface ServiceTypesTableProps {
	serviceTypes: Schema.ServiceType[]
}

export function ServiceTypesTable({ serviceTypes }: ServiceTypesTableProps) {
	const { t } = useTranslation()

	const handleDelete = (slug: string) => {
		router.delete(Routes.settingsServiceType(slug), {
			preserveScroll: true,
		})
	}

	const columns: TableColumn<Schema.ServiceType>[] = [
		{
			accessor: "name",
			title: t("views.settings.calendar.service_types_column_name"),
			render: (serviceType) => (
				<Group gap="sm">
					<Box
						className={ classes.colorSwatch }
						style={ { backgroundColor: serviceType.color } }
					/>
					<Text fw={ 500 }>{ serviceType.name }</Text>
					{ Boolean(serviceType.system) && (
						<Badge size="sm" variant="light" color="gray">
							{ t("views.settings.calendar.service_types_system_badge") }
						</Badge>
					) }
					{ !serviceType.active && (
						<Badge size="sm" variant="outline" color="gray">
							{ t("views.settings.calendar.service_types_inactive_badge") }
						</Badge>
					) }
				</Group>
			),
		},
		{
			accessor: "flags",
			title: t("views.settings.calendar.service_types_column_flags"),
			render: (serviceType) => (
				<Box className={ classes.flagList }>
					{ serviceType.assignable && <Badge size="xs" variant="light">{ t("views.settings.calendar.service_types_flag_assignable") }</Badge> }
					{ serviceType.billable && <Badge size="xs" variant="light">{ t("views.settings.calendar.service_types_flag_billable") }</Badge> }
					{ serviceType.payable && <Badge size="xs" variant="light">{ t("views.settings.calendar.service_types_flag_payable") }</Badge> }
					{ serviceType.allows_multi_client && <Badge size="xs" variant="light">{ t("views.settings.calendar.service_types_flag_multi_client") }</Badge> }
					{ serviceType.requires_notes && <Badge size="xs" variant="light">{ t("views.settings.calendar.service_types_flag_notes") }</Badge> }
					{ serviceType.tracks_mileage && <Badge size="xs" variant="light">{ t("views.settings.calendar.service_types_flag_mileage") }</Badge> }
				</Box>
			),
		},
		{
			accessor: "actions",
			title: t("views.settings.calendar.service_types_column_actions"),
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			render: (serviceType) => {
				const slug = serviceType.slug

				return (
					<Group gap="xs" justify="center" wrap="nowrap">
						{ slug && (
							<Modal
								title={ t("views.settings.calendar.service_types_form_title_edit") }
								trigger={ <EditButton label={ serviceType.name } /> }
							>
								<ServiceTypeFormModalBody serviceType={ serviceType } />
							</Modal>
						) }
						{ !serviceType.system && slug && (
							<DeleteButton
								label={ serviceType.name }
								onDelete={ () => handleDelete(slug) }
							/>
						) }
					</Group>
				)
			},
		},
	]

	return (
		<Table.Provider>
			<DataTable
				classNames={ { table: classes.table } }
				columns={ columns }
				records={ serviceTypes }
				selectable={ false }
				height="auto"
				emptyState={ (
					<Text size="sm" c="dimmed">
						{ t("views.settings.calendar.service_types_empty") }
					</Text>
				) }
			/>
		</Table.Provider>
	)
}
