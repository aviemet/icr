import React from 'react'
import { ImgProps } from 'react-html-props'
import classnames from 'classnames'

const CardImage = ({ src, className, ...rest }: ImgProps) => {
	return (
		<img
			src={ src }
			className={ classnames('w-full rounded-lg -mt-9 shadow-lg', className) }
			{ ...rest }
		/>
	)
}

export default CardImage
