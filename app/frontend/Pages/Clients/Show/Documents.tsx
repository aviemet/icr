import React from 'react'
import { type ShowClientProps } from '.'

interface ClientDocumentsProps extends ShowClientProps {}

const Documents = ({ client }: ClientDocumentsProps) => {
	return (
		<div>Documents</div>
	)
}

export default Documents
