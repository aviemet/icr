import { Title, Page, Section } from "@/components"
import { PermissionForm } from "@/domains/Permissions/Form"
import { Routes } from "@/lib"


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

				<PermissionForm
					method="put"
					to={ Routes.permission() }
					permission={ permission }
				/>
			</Section>
		</Page>
	)
}

export default EditPermission
