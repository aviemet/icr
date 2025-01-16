import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import UsersTable from '../Table'

interface UserIndexProps {
	users: Schema.UsersIndex[]
	pagination: Schema.Pagination
}

const UsersIndex = ({ users, pagination }: UserIndexProps) => {
	return (
		<IndexPageTemplate
			title="Users"
			model="users"
			rows={ users }
			pagination={ pagination }
			deleteRoute={ Routes.users() }
			menuOptions={ [
				{ label: 'New User', href: Routes.newUser(), icon: <NewIcon /> },
			] }
		>
			<UsersTable />
		</IndexPageTemplate>
	)
}

export default UsersIndex
