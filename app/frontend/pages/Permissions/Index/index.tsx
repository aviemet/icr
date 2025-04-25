import { Link } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Button, Card, Grid, Table, Title } from "@/components"
import { usePermissions } from "@/lib/hooks"

interface PermissionGroup {
	id: string
	name: string
	description: string
	precedence: number
	assignments: Array<{
		id: string
		permissionable_type: string
		permissionable: {
			id: string
			name?: string
			email?: string
		}
	}>
}

interface Props {
	groups: PermissionGroup[]
}

const Index = ({ groups }: Props) => {
	const { t } = useTranslation()
	const { can } = usePermissions()

	return (
		<Grid>
			<Grid.Col>
				<Card>
					<Card.Section inheritPadding py="xs">
						<Title>{ t("views.permissions.index.title") }</Title>
						{ can("create", "views.permission_groups") && (
							<Link href="/permissions/new">
								<Button>{ t("views.permissions.index.new") }</Button>
							</Link>
						) }
					</Card.Section>

					<Card.Section inheritPadding py="md">
						<Table>
							<Table.Head>
								<Table.Row>
									<Table.HeadCell>{ t("views.permissions.index.table.name") }</Table.HeadCell>
									<Table.HeadCell>{ t("views.permissions.index.table.description") }</Table.HeadCell>
									<Table.HeadCell>{ t("views.permissions.index.table.precedence") }</Table.HeadCell>
									<Table.HeadCell>{ t("views.permissions.index.table.assignments") }</Table.HeadCell>
									<Table.HeadCell>{ t("views.permissions.index.table.actions") }</Table.HeadCell>
								</Table.Row>
							</Table.Head>

							<Table.Body>
								{ groups.map(group => (
									<Table.Row key={ group.id }>
										<Table.Cell>{ group.name }</Table.Cell>
										<Table.Cell>{ group.description }</Table.Cell>
										<Table.Cell>{ group.precedence }</Table.Cell>
										<Table.Cell>
											{ group.assignments.map(assignment => (
												<div key={ assignment.id }>
													{ assignment.permissionable_type === "User"
														? assignment.permissionable.email
														: assignment.permissionable.name }
												</div>
											)) }
										</Table.Cell>
										<Table.Cell>
											{ can("update", "permission_groups") && (
												<Link href={ `/permissions/${group.id}/edit` }>
													<Button variant="secondary">Edit</Button>
												</Link>
											) }
											{ can("destroy", "permission_groups") && (
												<Link
													href={ `/permissions/${group.id}` }
													method="delete"
													as="button"
													type="button"
												>
													<Button variant="danger">Delete</Button>
												</Link>
											) }
										</Table.Cell>
									</Table.Row>
								)) }
							</Table.Body>
						</Table>
					</Card.Section>
				</Card>
			</Grid.Col>
		</Grid>
	)
}

export default Index
