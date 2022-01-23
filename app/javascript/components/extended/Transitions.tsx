import React from 'react'
import { forwardRef } from 'react'
import { Collapse, Fade, Box, Grow, Slide, Zoom } from '@mui/material'

interface TransitionsProps extends React.HTMLProps<HTMLDivElement> {
	position: 'top-left'|'top-right'|'top'|'bottom-left'|'bottom-right'|'bottom'
	type: 'grow'|'fade'|'collapse'|'slide'|'zoom'
	direction: 'up'|'down'|'left'|'right'
}

const Transitions = forwardRef<HTMLDivElement, TransitionsProps>(({ children, position = 'top-left', type = 'grow', direction = 'up', ...others }, ref) => {

	let transformOrigin = '0 0 0'

	switch (position) {
		case 'top-right':
			transformOrigin = 'top right'
			break
		case 'top':
			transformOrigin = 'top'
			break
		case 'bottom-left':
			transformOrigin = 'bottom left'
			break
		case 'bottom-right':
			transformOrigin = 'bottom right'
			break
		case 'bottom':
			transformOrigin = 'bottom'
			break
		case 'top-left':
		default:
			break
	}

	const positionSX = { transformOrigin }

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

export default Transitions
