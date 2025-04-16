import * as classes from "../TimeGrid.css"

interface AllDaySectionProps {
	children: React.ReactNode
}

export const AllDaySection = ({ children }: AllDaySectionProps) => {
	return (

		<div className={ classes.allDaySection }>
			<div className={ classes.cornerSpacer } />
			<div className={ classes.allDayEvents }>
				{ children }
			</div>
		</div>
	)
}
