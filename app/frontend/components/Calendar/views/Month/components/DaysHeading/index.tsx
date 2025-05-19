import clsx from "clsx"

import useStickySentinel from "@/lib/hooks/useStickySentinel"

import * as classes from "../../MonthView.css"

interface DaysHeadingProps {
	weekdays: string[]
}

const DaysHeading = ({ weekdays }: DaysHeadingProps) => {
	const [headerRef, isStuck] = useStickySentinel<HTMLDivElement>()

	return (
		<div ref={ headerRef } className={ clsx(classes.daysHeading, {
			stuck: !isStuck,
		}) }>
			{ weekdays.map(day => (
				<div key={ day } className={ clsx(classes.columnHeading) }>
					{ day }
				</div>
			)) }
		</div>
	)
}

export { DaysHeading }
