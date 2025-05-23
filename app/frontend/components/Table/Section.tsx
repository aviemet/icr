import { Section } from "@/components"

import * as classes from "./Table.css"

const TableSection = ({ children }: { children: React.ReactNode }) => {
	return (
		<Section fullHeight className={ classes.section }>
			{ children }
		</Section>
	)
}

export default TableSection
