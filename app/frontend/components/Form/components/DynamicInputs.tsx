import clsx from "clsx"
import { NestedFields, useDynamicInputs } from "use-inertia-form"

import { Box, Button, Flex, Grid, Paper } from "@/components"
import { PlusCircleIcon, MinusCircleIcon } from "@/components/Icons"

import * as classes from "../Form.css"

interface DynamicInputsProps {
	children: React.ReactNode | React.ReactElement[]
	model?: string
	label?: string | React.ReactNode
	emptyData: Record<string, unknown>
	grid?: boolean
}

const DynamicInputs = ({ children, model, label, emptyData, grid = true }: DynamicInputsProps) => {
	const { addInput, removeInput, paths } = useDynamicInputs({ model, emptyData })

	return (
		<>
			<Flex>
				<Box style={ { flex: 1 } }>{ label }</Box>
				<Button onClick={ () => addInput() } size="xs" mb="xs" mr="xs">
					<PlusCircleIcon />
				</Button>
			</Flex>

			{ paths.map((path, i) => (
				<NestedFields key={ i } model={ path }>
					<Flex key={ i } align="center" className={ clsx(classes.dynamicInputItem) }>
						<Paper p="xs" shadow="xs" mb="xs">
							<Box component={ grid ? Grid : undefined } style={ { flex: 1 } }>
								{ children }
							</Box>
						</Paper>
						<Button onClick={ () => removeInput(i) } ml="xs">
							<MinusCircleIcon />
						</Button>
					</Flex>
				</NestedFields>
			)) }
		</>
	)
}

export default DynamicInputs
