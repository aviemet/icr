import { Title, Page, Section } from "@/components"
import { Routes } from "@/lib"

import PermissionsForm from "../Form"


interface EditPermissionProps {
	permission: Schema.PermissionsEdit
}

const EditPermission = ({ permission }: EditPermissionProps) => {
	const title = "Edit Permission"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Permissions", href: Routes.permissions() },
			{ title: "Permission", href: Routes.permission(permission.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<PermissionsForm
					method="put"
					to={ Routes.permission() }
					permission={ permission }
				/>
			</Section>
		</Page>
	)
}

export default EditPermission
