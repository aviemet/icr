import { formatter } from '@/lib'
import { Stack, Tooltip } from '@/Components'
import ConditionalWrapper from '../ConditionalWrapper'
import { isEmpty } from 'lodash'
import { TooltipBaseProps } from '@mantine/core/lib/components/Tooltip/Tooltip.types'

interface DateTimeDisplayProps {
	children: string | Date | undefined
	format?: keyof typeof formatter['datetime']
	tooltipFormats?: (keyof typeof formatter['datetime'])[]
	tooltipOptions?: TooltipBaseProps
}

const DateTimeDisplay = ({
	children,
	format = 'dateShort',
	tooltipFormats,
	tooltipOptions,
}: DateTimeDisplayProps) => {
	if(!children) return <></>

	return (
		<>
			<ConditionalWrapper
				condition={ !isEmpty(tooltipFormats) }
				wrapper={ innerChildren => {
					const tooltipProps = Object.assign({}, tooltipOptions, {
						position: 'bottom',
						openDelay: 750,
					})
					return (
						<Tooltip
							{ ...tooltipProps }
							label={ <Stack>{ tooltipFormats!.map(f => (
								<time
									key={ f }
									dateTime={ children.toString() }
								>
									{ formatter.datetime[f](children) }
								</time>
							)) }</Stack> }
						>
							{ innerChildren }
						</Tooltip>
					)
				} }
			>
				<time dateTime={ children.toString() }>{ formatter.datetime[format](children) }</time>
			</ConditionalWrapper>
		</>
	)
}

export default DateTimeDisplay
