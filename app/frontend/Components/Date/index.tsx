import React from 'react'
import { formatter } from '@/lib'
import { Box, Text, Tooltip } from '@/Components'
import ConditionalWrapper from '../ConditionalWrapper'
import { isEmpty } from 'lodash'
import { TooltipBaseProps } from '@mantine/core/lib/components/Tooltip/Tooltip.types'

interface DateProps {
	children: string | Date | undefined
	format?: keyof typeof formatter.date
	tooltipFormats?: (keyof typeof formatter.date)[]
	tooltipOptions?: TooltipBaseProps
}

const Date = ({ children, format = 'short', tooltipFormats, tooltipOptions }: DateProps) => {
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
							label={ <Box>{ tooltipFormats!.map(f => (
								<Date format={ f }>{ children }</Date>
							)) }</Box> }
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

export default Date
