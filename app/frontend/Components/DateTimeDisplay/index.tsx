import React from 'react'
import { formatter } from '@/lib'
import { Stack, Tooltip } from '@/Components'
import ConditionalWrapper from '../ConditionalWrapper'
import { isEmpty } from 'lodash'
import { TooltipBaseProps } from '@mantine/core/lib/components/Tooltip/Tooltip.types'
type DateTimeDisplayProps = |
{
	type?: 'date'
	children: string | Date | undefined
	format?: keyof typeof formatter['date']
	tooltipFormats?: (keyof typeof formatter['date'])[]
	tooltipOptions?: TooltipBaseProps
} | {
	type: 'time'
	children: string | Date | undefined
	format?: keyof typeof formatter['time']
	tooltipFormats?: (keyof typeof formatter['time'])[]
	tooltipOptions?: TooltipBaseProps
} | {
	type: 'datetime'
	children: string | Date | undefined
	format?: keyof typeof formatter['datetime']
	tooltipFormats?: (keyof typeof formatter['datetime'])[]
	tooltipOptions?: TooltipBaseProps
};

const DateTimeDisplay = ({
	children,
	format = 'short',
	tooltipFormats,
	tooltipOptions,
	type = 'date',
}: DateTimeDisplayProps) => {
	if(!children) return <></>

	return (
		<>
			<ConditionalWrapper
				condition={ !isEmpty(tooltipFormats) }
				wrapper={ innerChildren => {
					const tooltipProps = Object.assign({}, tooltipOptions, {
						position: 'bottom',
					})
					return (
						<Tooltip
							{ ...tooltipProps }
							label={ <Stack>{ tooltipFormats!.map(f => (
								<time dateTime={ children.toString() }>{ formatter[type][f](children) }</time>
							)) }</Stack> }
						>
							{ innerChildren }
						</Tooltip>
					)
				} }
			>
				<time dateTime={ children.toString() }>{ formatter[type][format](children) }</time>
			</ConditionalWrapper>
		</>
	)
}

export default DateTimeDisplay
