import { Grid } from "@/Components"
import { Checkbox } from "@/Components/Form"
import FormGroup from "@/Components/Form/Components/FormGroup"

const PERMISSIONS = [
	"index",
	"show",
	"create",
	"update",
	"destroy",
] as const

const RESOURCE_TYPES = [
	"employee",
	"client",
	"doctor",
	"vendor",
] as const

const PermissionsSection = () => {
	return (
		<FormGroup legend="Permissions">
			{ RESOURCE_TYPES.map(resourceType => (
				<Grid.Col key={ resourceType }>
					<Checkbox.Group
						name={ `roles.${resourceType}` }
						label={ resourceType.charAt(0).toUpperCase() + resourceType.slice(1) }
					>
						{ PERMISSIONS.map(permission => (
							<Checkbox
								key={ `${resourceType}_${permission}` }
								value={ permission }
								label={ permission.charAt(0).toUpperCase() + permission.slice(1) }
							/>
						)) }
					</Checkbox.Group>
				</Grid.Col>
			)) }
		</FormGroup>
	)
}

export default PermissionsSection
