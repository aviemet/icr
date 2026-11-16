import { useTranslation } from "react-i18next"

import { Button, Card, Grid, Link, Title } from "@/components"
import { PermissionTable, type PermissionTableRecord } from "@/domains/Permissions/Table"
import { usePermissions } from "@/lib/hooks"

interface Props {
	groups: PermissionTableRecord[]
	pagination?: Schema.Pagination
}

const Index = ({ groups, pagination }: Props) => {
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
						<PermissionTable records={ groups } pagination={ pagination } model="permission_groups" />
					</Card.Section>
				</Card>
			</Grid.Col>
		</Grid>
	)
}

export default Index
