import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import PeopleTable from "@/features/Settings/People/Table"
import { Routes } from "@/lib"
import { withLayout } from "@/lib/withLayout"

interface PersonIndexProps {
	people: Schema.PeopleIndex[]
	pagination: Schema.Pagination
}

const PeopleIndex = ({ people, pagination }: PersonIndexProps) => {
	return (
		<IndexPageTemplate
			title="People"
			model="people"
			rows={ people }
			pagination={ pagination }
			menuOptions={ [
				{ label: "New Person", href: Routes.newSettingsPerson(), icon: <NewIcon /> },
			] }
		>
			<PeopleTable />
		</IndexPageTemplate>
	)
}

export default withLayout(PeopleIndex, "settings")
