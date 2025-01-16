import { Routes } from "@/lib"
import { IndexPageTemplate } from "@/Features"
import { NewIcon } from "@/Components/Icons"
import PeopleTable from "../Table"

interface PersonIndexProps {
	people: Schema.PeopleIndex[]
	pagination: Schema.Pagination
}

const PeopleIndex = ({ people, pagination }: PersonIndexProps) => {
	return (
		<IndexPageTemplate
			title="Users"
			model="people"
			rows={ people }
			pagination={ pagination }
			deleteRoute={ Routes.users() }
			menuOptions={ [
				{ label: "New User", href: Routes.newUser(), icon: <NewIcon /> },
			] }
		>
			<PeopleTable />
		</IndexPageTemplate>
	)
}

export default PeopleIndex
