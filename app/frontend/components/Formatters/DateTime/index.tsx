import { isEmpty } from "lodash-es"

import { Stack, Tooltip, type TooltipProps } from "@/components"
import { ConditionalWrapper } from "@/components"
import { formatter } from "@/lib"

const datetimeSingleArg = Object.fromEntries(
	Object.entries(formatter.datetime).filter(([key]) => key !== "range")
) as Omit<typeof formatter.datetime, "range">
type DateTimeSingleArgKey = keyof typeof datetimeSingleArg

export interface DateTimeFormatterProps {
	children: string | Date | undefined
	format?: DateTimeSingleArgKey
	tooltipFormats?: DateTimeSingleArgKey[]
	tooltipOptions?: TooltipProps
}

export function DateTimeFormatter({
	children,
	format = "dateShort",
	tooltipFormats,
	tooltipOptions,
}: DateTimeFormatterProps) {
	if(!children) return <></>

	return (
		<>
			<ConditionalWrapper
				condition={ !isEmpty(tooltipFormats) }
				wrapper={ innerChildren => {
					const tooltipProps = Object.assign({}, tooltipOptions, {
						position: "bottom",
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
									{ datetimeSingleArg[f](children) }
								</time>
							)) }</Stack> }
						>
							{ innerChildren }
						</Tooltip>
					)
				} }
			>
				<time dateTime={ children.toString() }>{ datetimeSingleArg[format](children) }</time>
			</ConditionalWrapper>
		</>
	)
}
