import clsx from "clsx"
import { DivProps } from "react-html-props"
import { NestedFields } from "use-inertia-form"

import { ConditionalWrapper, Grid, Box } from "@/components"

interface FormGroupProps extends DivProps {
	legend?: string
	outline?: boolean
	model?: string
	grid?: boolean
}

const FormGroup = ({
	children,
	legend,
	outline = true,
	model,
	grid = false,
}: FormGroupProps) => {
	return (
		<ConditionalWrapper
			condition={ grid }
			wrapper={ children => (
				<Grid.Col>
					<Grid component="fieldset" className={ clsx({ outline }) } style={ {
						marginTop: legend ? "0.5rem" : undefined,
					} }>
						{ children }
					</Grid>
				</Grid.Col>
			) }
			elseWrapper={ children => (
				<Box component="fieldset" className={ clsx({ outline }) } style={ {
					marginTop: legend ? "0.5rem" : undefined,
				} }>
					{ children }
				</Box>
			) }
		>
			<ConditionalWrapper
				condition={ model !== undefined }
				wrapper={ children => <NestedFields model={ model! }>{ children }</NestedFields> }
			>
				<>
					{ legend && <legend>{ legend }</legend> }
					{ children }
				</>
			</ConditionalWrapper>
		</ConditionalWrapper>
	)
}

export default FormGroup
