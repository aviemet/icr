import React, { forwardRef } from 'react'
import Tippy from '@tippyjs/react'
import { roundArrow } from 'tippy.js'

const Popover = forwardRef(({ children, placement }, ref) => {
	return (
		<Tippy
			content={ children }
			placement={ placement }
			reference={ ref }
			trigger="click"
			animation="shift-away"
			arrow={ roundArrow }
			className="arrow-light"
			interactive
		/>
	)
})

Popover.defaultProps = {
	placement: 'top',
}

Popover.propTypes = {
	children: PropTypes.node.isRequired,
	placement: PropTypes.string.isRequired,
}

export default Popover
