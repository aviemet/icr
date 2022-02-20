import React from 'react'
import { forwardRef } from 'react'
import { Collapse, Fade, Box, Grow, Slide, Zoom } from '@mui/material'

interface TransitionProps {
	children?: React.ReactNode
	position?: 'top-left'|'top-right'|'top'|'bottom-left'|'bottom-right'|'bottom'
	type?: 'grow'|'fade'|'collapse'|'slide'|'zoom'
	direction?: 'up'|'down'|'left'|'right'
}

const Transition = forwardRef<React.Ref<unknown>, TransitionProps>((
	{ children, position = 'top-left', type = 'grow', direction = 'up', ...others },
	ref
) => {
	const positionSX = {
		transformOrigin: '0 0 0'
	 }

	switch (position) {
		case 'top-right':
			positionSX.transformOrigin = 'top right'
			break
		case 'top':
			positionSX.transformOrigin = 'top'
			break
		case 'bottom-left':
			positionSX.transformOrigin = 'bottom left'
			break
		case 'bottom-right':
			positionSX.transformOrigin = 'bottom right'
			break
		case 'bottom':
			positionSX.transformOrigin = 'bottom'
			break
		default: // default case must be 'top-left' if relying on prop type
			break
	}

	return (
		<Box ref={ ref }>
			{ {
				grow:
					<Grow { ...others }>
						<Box sx={ positionSX }>{ children }</Box>
					</Grow>,

				collapse:
					<Collapse { ...others } sx={ positionSX }>
						{ children }
					</Collapse>,

				fade:
					<Fade
						{ ...others }
						timeout={ {
							appear: 500,
							enter: 600,
							exit: 400
						} }
					>
						<Box sx={ positionSX }>{ children }</Box>
					</Fade>,

				slide:
					<Slide
						{ ...others }
						timeout={ {
							appear: 0,
							enter: 400,
							exit: 200
						} }
						direction={ direction }
					>
						<Box sx={ positionSX }>{ children }</Box>
					</Slide>,

				zoom:
					<Zoom { ...others }>
						<Box sx={ positionSX }>{ children }</Box>
					</Zoom>
			}[type] }
		</Box>
	)
})

export default Transition
