import React from 'react'
import { formatter } from '@/lib'
import { Stack, Text, Tooltip } from '@/Components'
import ConditionalWrapper from '../ConditionalWrapper'
import { isEmpty } from 'lodash'
import { TooltipBaseProps } from '@mantine/core/lib/components/Tooltip/Tooltip.types'

interface DateDisplayProps {
	children: string | Date | undefined
	format?: keyof typeof formatter.date
	tooltipFormats?: (keyof typeof formatter.date)[]
	tooltipOptions?: TooltipBaseProps
}

const DateDisplay = ({ children, format = 'short', tooltipFormats, tooltipOptions }: DateDisplayProps) => {
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
								<DateDisplay key={ f } format={ f }>{ children }</DateDisplay>
							)) }</Stack> }
						>
							{ innerChildren }
						</Tooltip>
					)
				} }
			>
				<Text>{ formatter.date[format](children) }</Text>
			</ConditionalWrapper>
		</>
	)
}

export default DateDisplay
