import { NewIcon } from "@/components/Icons"
import { PersonTable } from "@/domains/Settings/People/Table"
import { IndexPageTemplate } from "@/features"
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
			pagination={ pagination }
			actions={ [
				{ label: "New Person", href: Routes.newSettingsPerson(), icon: <NewIcon /> },
			] }
		>
			<PersonTable records={ people } model="people" />
		</IndexPageTemplate>
	)
}

export default withLayout(PeopleIndex, "settings")
