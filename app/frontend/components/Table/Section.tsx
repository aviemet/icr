import { Section } from "@/components"

import * as classes from "./Table.css"

export function TableSection({ children }: { children: React.ReactNode }) {
	return (
		<Section fullHeight className={ classes.section }>
			{ children }
		</Section>
	)
}
