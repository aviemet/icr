import React from 'react'
import { ImgProps } from 'react-html-props'

const Image = ({ src, ...props }: ImgProps) => {
	return <img src={ src } { ...props } />
}

export default Image
