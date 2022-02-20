import React, { Suspense } from 'react'
import Loader from '@/Components/Loader'

const Loadable = (Component) => (props) => (
	<Suspense fallback={ <Loader /> }>
		<Component { ...props } />
	</Suspense>
)

export default Loadable
